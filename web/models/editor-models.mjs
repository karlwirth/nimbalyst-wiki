// ../../../nimbalyst-mindmap/src/model.ts
var idCounter = 0;
function generateNodeId() {
  return `node_${Date.now()}_${idCounter++}`;
}
function createEmptyDocument() {
  const rootId = "node_root";
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    version: 1,
    title: "Untitled map",
    rootId,
    nodes: {
      [rootId]: {
        id: rootId,
        text: "Central idea",
        note: "",
        parentId: null,
        childIds: [],
        position: { x: 0, y: 0 },
        tags: [],
        status: "none",
        color: "default",
        link: "",
        pinned: false
      }
    },
    metadata: {
      layout: "balanced",
      createdAt: now,
      updatedAt: now,
      canvas: { viewport: { x: 0, y: 0, zoom: 1 } }
    }
  };
}
var VALID_STATUSES = ["idea", "question", "todo", "in-progress", "done"];
var VALID_COLORS = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];
function parseInlineMetadata(raw) {
  const result = { text: raw, color: "default", status: "none", tags: [], link: "", pinned: false };
  const metaMatch = raw.match(/\{([^}]+)\}\s*$/);
  if (!metaMatch) return result;
  result.text = raw.slice(0, metaMatch.index).trim();
  const metaStr = metaMatch[1];
  const keyValuePairs = [];
  const keyPattern = /\b(color|status|tags|link|trackers|pinned|x|y)\s*:/g;
  let match;
  const starts = [];
  while ((match = keyPattern.exec(metaStr)) !== null) {
    starts.push({ key: match[1], start: match.index + match[0].length });
  }
  for (let i = 0; i < starts.length; i++) {
    const end = i + 1 < starts.length ? metaStr.lastIndexOf(",", starts[i + 1].start) : metaStr.length;
    keyValuePairs.push({
      key: starts[i].key,
      val: metaStr.slice(starts[i].start, end).trim()
    });
  }
  for (const { key, val } of keyValuePairs) {
    switch (key) {
      case "color":
        if (VALID_COLORS.includes(val)) result.color = val;
        break;
      case "status":
        if (VALID_STATUSES.includes(val)) result.status = val;
        break;
      case "tags":
        result.tags = val.split(",").map((t) => t.trim()).filter(Boolean);
        break;
      case "link":
        result.link = val;
        break;
      case "trackers": {
        const [referenceKey] = val.split(",").map((part) => part.trim()).filter(Boolean);
        if (!result.link && referenceKey) result.link = `nimbalyst://${referenceKey.replace(/^nimbalyst:\/\//i, "")}`;
        break;
      }
      case "pinned":
        result.pinned = val === "true";
        break;
      case "x": {
        const x = Number(val);
        if (Number.isFinite(x)) result.x = x;
        break;
      }
      case "y": {
        const y = Number(val);
        if (Number.isFinite(y)) result.y = y;
        break;
      }
    }
  }
  return result;
}
function formatInlineMetadata(node) {
  const parts = [];
  if (node.color !== "default") parts.push(`color: ${node.color}`);
  if (node.status !== "none") parts.push(`status: ${node.status}`);
  if (node.tags.length > 0) parts.push(`tags: ${node.tags.join(", ")}`);
  if (node.link) parts.push(`link: ${node.link}`);
  if (node.pinned) {
    parts.push("pinned: true");
    parts.push(`x: ${Math.round(node.position.x)}`);
    parts.push(`y: ${Math.round(node.position.y)}`);
  }
  return parts.length > 0 ? ` {${parts.join(", ")}}` : "";
}
function parseDocument(raw) {
  if (!raw || !raw.trim()) {
    return createEmptyDocument();
  }
  const lines = raw.split("\n");
  let lineIdx = 0;
  let title = "";
  let layout = "balanced";
  if (lines[0]?.trim() === "---") {
    lineIdx = 1;
    while (lineIdx < lines.length && lines[lineIdx].trim() !== "---") {
      const fmMatch = lines[lineIdx].match(/^(\w+):\s*(.*)/);
      if (fmMatch && fmMatch[1] === "title") {
        title = fmMatch[2].trim();
      } else if (fmMatch && fmMatch[1] === "layout" && (fmMatch[2].trim() === "balanced" || fmMatch[2].trim() === "right")) {
        layout = fmMatch[2].trim();
      }
      lineIdx++;
    }
    lineIdx++;
  }
  const rootId = "node_root";
  const nodes = {};
  const stack = [];
  function addNode(text, depth, meta) {
    const isRoot = stack.length === 0;
    const id2 = isRoot ? rootId : generateNodeId();
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    const parentId = stack.length > 0 ? stack[stack.length - 1].id : null;
    nodes[id2] = {
      id: id2,
      text,
      note: "",
      parentId,
      childIds: [],
      position: { x: meta.x ?? 0, y: meta.y ?? 0 },
      tags: meta.tags,
      status: meta.status,
      color: meta.color,
      link: meta.link,
      pinned: meta.pinned
    };
    if (parentId && nodes[parentId]) {
      nodes[parentId].childIds.push(id2);
    }
    stack.push({ id: id2, depth });
    return id2;
  }
  let listBaseDepth = 1;
  while (lineIdx < lines.length) {
    const line = lines[lineIdx];
    lineIdx++;
    if (!line.trim()) continue;
    if (line.match(/^\s*>/)) {
      if (stack.length > 0) {
        const lastNode = nodes[stack[stack.length - 1].id];
        if (lastNode) {
          const noteText = line.replace(/^\s*>\s?/, "");
          lastNode.note = lastNode.note ? lastNode.note + "\n" + noteText : noteText;
        }
      }
      continue;
    }
    const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const depth = level - 1;
      const meta = parseInlineMetadata(headingMatch[2].trim());
      addNode(meta.text, depth, meta);
      listBaseDepth = depth + 1;
      continue;
    }
    const listMatch = line.match(/^(\s*)[-*]\s+(.*)/);
    if (listMatch) {
      const indent = listMatch[1].length;
      const listDepth = listBaseDepth + Math.floor(indent / 2);
      const meta = parseInlineMetadata(listMatch[2].trim());
      addNode(meta.text, listDepth, meta);
      continue;
    }
  }
  if (!nodes[rootId]) {
    return createEmptyDocument();
  }
  if (!title) {
    title = nodes[rootId].text;
  }
  return {
    version: 1,
    title,
    rootId,
    nodes,
    metadata: {
      layout,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      canvas: { viewport: { x: 0, y: 0, zoom: 1 } }
    }
  };
}
function serializeDocument(doc) {
  const lines = [];
  lines.push("---");
  lines.push(`title: ${doc.title}`);
  lines.push(`layout: ${doc.metadata.layout}`);
  lines.push("---");
  lines.push("");
  function serializeNode(nodeId, depth) {
    const node = doc.nodes[nodeId];
    if (!node) return;
    const meta = formatInlineMetadata(node);
    if (depth <= 2) {
      const prefix = "#".repeat(depth + 1);
      lines.push(`${prefix} ${node.text}${meta}`);
    } else {
      const indent = "  ".repeat(depth - 3);
      lines.push(`${indent}- ${node.text}${meta}`);
    }
    if (node.note) {
      const noteLines = node.note.split("\n");
      for (const noteLine of noteLines) {
        if (depth <= 2) {
          lines.push(`> ${noteLine}`);
        } else {
          const indent = "  ".repeat(depth - 3);
          lines.push(`${indent}  > ${noteLine}`);
        }
      }
    }
    if (depth <= 2 && node.childIds.length > 0) {
      const firstChild = doc.nodes[node.childIds[0]];
      if (firstChild && depth + 1 <= 2) {
        lines.push("");
      }
    }
    for (const childId of node.childIds) {
      serializeNode(childId, depth + 1);
    }
    if (depth === 1) {
      lines.push("");
    }
  }
  serializeNode(doc.rootId, 0);
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
function applyMindmapOperations(document2, operations) {
  if (operations.length === 0) return { document: document2, createdNodeIds: {} };
  if (operations.length > 200) throw new Error("A batch may contain at most 200 operations");
  let nodes = Object.fromEntries(
    Object.entries(document2.nodes).map(([id2, node]) => [id2, {
      ...node,
      childIds: [...node.childIds],
      tags: [...node.tags]
    }])
  );
  const aliases = {};
  const resolve = (value) => aliases[value] ?? value;
  const requireNode = (value) => {
    const id2 = resolve(value);
    const node = nodes[id2];
    if (!node) throw new Error(`Node ${value} not found`);
    return node;
  };
  const isDescendant = (ancestorId, candidateId) => {
    let current = candidateId;
    while (current) {
      if (current === ancestorId) return true;
      current = nodes[current]?.parentId ?? null;
    }
    return false;
  };
  const deleteRecursive = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return;
    for (const childId of [...node.childIds]) deleteRecursive(childId);
    if (node.parentId && nodes[node.parentId]) {
      nodes[node.parentId] = { ...nodes[node.parentId], childIds: nodes[node.parentId].childIds.filter((id2) => id2 !== nodeId) };
    }
    delete nodes[nodeId];
  };
  for (const operation of operations) {
    if (operation.type === "add") {
      const parent = requireNode(operation.parentId);
      const id2 = generateNodeId();
      if (operation.alias) {
        if (aliases[operation.alias] || nodes[operation.alias]) throw new Error(`Duplicate alias ${operation.alias}`);
        aliases[operation.alias] = id2;
      }
      const childIds = [...parent.childIds];
      const index = operation.index === void 0 ? childIds.length : Math.max(0, Math.min(childIds.length, operation.index));
      childIds.splice(index, 0, id2);
      nodes[parent.id] = { ...parent, childIds };
      nodes[id2] = {
        id: id2,
        text: operation.text.trim() || "Untitled",
        note: operation.note ?? "",
        parentId: parent.id,
        childIds: [],
        position: { x: parent.position.x + 230, y: parent.position.y },
        tags: operation.tags ?? [],
        status: operation.status ?? "none",
        color: operation.color ?? "default",
        link: operation.link ?? "",
        pinned: false
      };
    } else if (operation.type === "update") {
      const node = requireNode(operation.nodeId);
      const updates = Object.fromEntries(
        Object.entries(operation).filter(([key, value]) => key !== "type" && key !== "nodeId" && value !== void 0)
      );
      nodes[node.id] = { ...node, ...updates };
    } else if (operation.type === "delete") {
      const node = requireNode(operation.nodeId);
      if (node.id === document2.rootId) throw new Error("Cannot delete the root node");
      deleteRecursive(node.id);
    } else if (operation.type === "move") {
      const node = requireNode(operation.nodeId);
      const requestedParent = requireNode(operation.newParentId);
      if (node.id === document2.rootId) throw new Error("Cannot move the root node");
      if (isDescendant(node.id, requestedParent.id)) throw new Error(`Cannot move ${node.id} under its descendant ${requestedParent.id}`);
      if (node.parentId && nodes[node.parentId]) {
        nodes[node.parentId] = { ...nodes[node.parentId], childIds: nodes[node.parentId].childIds.filter((id2) => id2 !== node.id) };
      }
      const parent = nodes[requestedParent.id];
      const childIds = [...parent.childIds];
      const index = operation.index === void 0 ? childIds.length : Math.max(0, Math.min(childIds.length, operation.index));
      childIds.splice(index, 0, node.id);
      nodes[parent.id] = { ...parent, childIds };
      nodes[node.id] = { ...node, parentId: parent.id, pinned: false };
    }
  }
  return { document: { ...document2, nodes }, createdNodeIds: aliases };
}

// ../extensions/excalidraw/src/utils/elementFactory.ts
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
function normalizeColor(color) {
  if (!color) return void 0;
  const colorMap = {
    red: "#ffc9c9",
    green: "#b2f2bb",
    blue: "#a5d8ff",
    yellow: "#ffec99",
    orange: "#ffd8a8",
    purple: "#e599f7",
    pink: "#ffc0cb",
    gray: "#e9ecef",
    grey: "#e9ecef"
  };
  return colorMap[color.toLowerCase()] || color;
}
function createRectangle(options) {
  const {
    x,
    y,
    width = 150,
    height = 80,
    style = "default",
    backgroundColor,
    strokeColor,
    roundness,
    groupIds = []
  } = options;
  const styleColors = {
    default: "#1971c2",
    highlight: "#f08c00",
    muted: "#868e96"
  };
  return {
    id: generateId(),
    type: "rectangle",
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: normalizeColor(strokeColor) || styleColors[style] || styleColors.default,
    backgroundColor: normalizeColor(backgroundColor) || "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds,
    frameId: null,
    roundness: roundness !== void 0 ? roundness : { type: 3 },
    seed: Math.floor(Math.random() * 1e6),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e6),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false
  };
}
function createText(options) {
  const { x, y, text, fontSize = 20, containerId } = options;
  const charWidth = fontSize * 0.6;
  const width = text.length * charWidth;
  const height = fontSize * 1.5;
  return {
    id: generateId(),
    type: "text",
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: "#000000",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: Math.floor(Math.random() * 1e6),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e6),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    text,
    fontSize,
    fontFamily: 1,
    textAlign: "center",
    verticalAlign: "middle",
    baseline: fontSize,
    containerId: containerId || null,
    originalText: text,
    lineHeight: 1.25
  };
}
function createArrow(options) {
  const {
    startX,
    startY,
    endX,
    endY,
    startElementId,
    endElementId,
    label,
    groupIds = []
  } = options;
  const elements = [];
  const arrowId = generateId();
  const arrow = {
    id: arrowId,
    type: "arrow",
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    angle: 0,
    strokeColor: "#000000",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds,
    frameId: null,
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 1e6),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e6),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    points: [
      [0, 0],
      [endX - startX, endY - startY]
    ],
    lastCommittedPoint: null,
    startBinding: startElementId ? {
      elementId: startElementId,
      focus: 0,
      gap: 10
    } : null,
    endBinding: endElementId ? {
      elementId: endElementId,
      focus: 0,
      gap: 10
    } : null,
    startArrowhead: null,
    endArrowhead: "arrow"
  };
  elements.push(arrow);
  if (label) {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const labelElement = createText({
      x: midX - label.length * 10 / 2,
      y: midY - 10,
      text: label,
      fontSize: 16
    });
    labelElement.groupIds = groupIds;
    elements.push(labelElement);
  }
  return elements;
}
function createLabeledRectangle(options) {
  const {
    x,
    y,
    width = 150,
    height = 80,
    text,
    groupIds = []
  } = options;
  const rectangle = createRectangle({ ...options, text: "" });
  const rectId = rectangle.id;
  const textElement = createText({
    x: x + width / 2 - text.length * 10 / 2,
    y: y + height / 2 - 10,
    text,
    fontSize: 16,
    containerId: rectId
  });
  textElement.groupIds = groupIds;
  rectangle.boundElements = [{ id: textElement.id, type: "text" }];
  return {
    rectangle,
    text: textElement
  };
}
function createFrame(options) {
  const { x, y, width, height, name } = options;
  return {
    id: generateId(),
    type: "frame",
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: "#000000",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: Math.floor(Math.random() * 1e6),
    version: 1,
    versionNonce: Math.floor(Math.random() * 1e6),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    name: name || null
  };
}

// ../extensions/excalidraw/src/layout/LayoutEngine.ts
var LayoutEngine = class {
  nodes = /* @__PURE__ */ new Map();
  /**
   * Add elements to the layout graph
   */
  addElements(elements) {
    this.nodes.clear();
    for (const element of elements) {
      if (element.type === "arrow") continue;
      this.nodes.set(element.id, {
        id: element.id,
        element,
        width: element.width || 150,
        height: element.height || 80,
        x: element.x || 0,
        y: element.y || 0,
        connections: []
      });
    }
    for (const element of elements) {
      if (element.type === "arrow") {
        const start = element.startBinding?.elementId;
        const end = element.endBinding?.elementId;
        if (start && this.nodes.has(start)) {
          const node = this.nodes.get(start);
          if (end && !node.connections.includes(end)) {
            node.connections.push(end);
          }
        }
      }
    }
  }
  /**
   * Calculate optimal position for a new element near an existing one
   */
  calculateNearPosition(nearElementId, newWidth, newHeight) {
    const nearNode = this.nodes.get(nearElementId);
    if (!nearNode) {
      return this.calculateDefaultPosition(newWidth, newHeight);
    }
    const spacing = 100;
    const candidates = [
      { x: nearNode.x + nearNode.width + spacing, y: nearNode.y },
      { x: nearNode.x, y: nearNode.y + nearNode.height + spacing },
      { x: nearNode.x - newWidth - spacing, y: nearNode.y },
      { x: nearNode.x, y: nearNode.y - newHeight - spacing }
    ];
    for (const pos of candidates) {
      if (!this.hasOverlap(pos.x, pos.y, newWidth, newHeight)) {
        return pos;
      }
    }
    return {
      x: nearNode.x + nearNode.width + spacing,
      y: nearNode.y
    };
  }
  /**
   * Calculate default position when no reference element is given
   */
  calculateDefaultPosition(_width, _height) {
    if (this.nodes.size === 0) {
      return { x: 100, y: 100 };
    }
    let maxX = 0;
    let maxY = 0;
    for (const node of this.nodes.values()) {
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y);
    }
    return {
      x: maxX + 100,
      y: maxY
    };
  }
  /**
   * Check if a position would overlap with existing elements
   */
  hasOverlap(x, y, width, height) {
    const padding = 20;
    for (const node of this.nodes.values()) {
      const overlapX = x < node.x + node.width + padding && x + width > node.x - padding;
      const overlapY = y < node.y + node.height + padding && y + height > node.y - padding;
      if (overlapX && overlapY) {
        return true;
      }
    }
    return false;
  }
  /**
   * Run full layout on all elements
   */
  layout(options) {
    switch (options.algorithm) {
      case "hierarchical":
        return this.hierarchicalLayout(options);
      case "force-directed":
        return this.forceDirectedLayout(options);
      case "grid":
        return this.gridLayout(options);
      default:
        return /* @__PURE__ */ new Map();
    }
  }
  /**
   * Hierarchical layout (suitable for flow diagrams)
   */
  hierarchicalLayout(options) {
    const positions = /* @__PURE__ */ new Map();
    const spacing = options.spacing || 150;
    const direction = options.direction || "TB";
    const layers = [];
    const visited = /* @__PURE__ */ new Set();
    const hasIncoming = /* @__PURE__ */ new Set();
    for (const node of this.nodes.values()) {
      for (const targetId of node.connections) {
        hasIncoming.add(targetId);
      }
    }
    const roots = [];
    for (const node of this.nodes.values()) {
      if (!hasIncoming.has(node.id)) {
        roots.push(node.id);
      }
    }
    let currentLayer = roots.length > 0 ? roots : Array.from(this.nodes.keys()).slice(0, 1);
    layers.push(currentLayer);
    while (currentLayer.length > 0) {
      const nextLayer = [];
      for (const nodeId of currentLayer) {
        visited.add(nodeId);
        const node = this.nodes.get(nodeId);
        if (!node) continue;
        for (const targetId of node.connections) {
          if (!visited.has(targetId) && !nextLayer.includes(targetId)) {
            nextLayer.push(targetId);
          }
        }
      }
      if (nextLayer.length > 0) {
        layers.push(nextLayer);
      }
      currentLayer = nextLayer;
    }
    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        if (layers.length === 0) {
          layers.push([]);
        }
        layers[layers.length - 1].push(nodeId);
      }
    }
    const isHorizontal = direction === "LR" || direction === "RL";
    const isReverse = direction === "BT" || direction === "RL";
    layers.forEach((layer, layerIndex) => {
      const actualLayerIndex = isReverse ? layers.length - 1 - layerIndex : layerIndex;
      layer.forEach((nodeId, indexInLayer) => {
        const node = this.nodes.get(nodeId);
        if (!node) return;
        const offsetInLayer = (indexInLayer - (layer.length - 1) / 2) * spacing;
        if (isHorizontal) {
          positions.set(nodeId, {
            x: actualLayerIndex * spacing + 100,
            y: offsetInLayer + 300
          });
        } else {
          positions.set(nodeId, {
            x: offsetInLayer + 300,
            y: actualLayerIndex * spacing + 100
          });
        }
      });
    });
    return positions;
  }
  /**
   * Force-directed layout (suitable for network diagrams)
   */
  forceDirectedLayout(_options) {
    const positions = /* @__PURE__ */ new Map();
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    Array.from(this.nodes.keys()).forEach((nodeId, index) => {
      const angle = index / this.nodes.size * 2 * Math.PI;
      positions.set(nodeId, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    });
    const iterations = 50;
    const repulsionStrength = 5e4;
    const attractionStrength = 0.01;
    const damping = 0.8;
    for (let iter = 0; iter < iterations; iter++) {
      const forces = /* @__PURE__ */ new Map();
      for (const nodeId of this.nodes.keys()) {
        forces.set(nodeId, { x: 0, y: 0 });
      }
      for (const id1 of this.nodes.keys()) {
        for (const id2 of this.nodes.keys()) {
          if (id1 === id2) continue;
          const pos1 = positions.get(id1);
          const pos2 = positions.get(id2);
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distSq = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(distSq);
          const force = repulsionStrength / distSq;
          const fx = dx / dist * force;
          const fy = dy / dist * force;
          const f1 = forces.get(id1);
          f1.x += fx;
          f1.y += fy;
        }
      }
      for (const [id1, node1] of this.nodes) {
        for (const id2 of node1.connections) {
          if (!positions.has(id2)) continue;
          const pos1 = positions.get(id1);
          const pos2 = positions.get(id2);
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const fx = dx * attractionStrength;
          const fy = dy * attractionStrength;
          const f1 = forces.get(id1);
          f1.x += fx;
          f1.y += fy;
          const f2 = forces.get(id2);
          f2.x -= fx;
          f2.y -= fy;
        }
      }
      for (const [nodeId, force] of forces) {
        const pos = positions.get(nodeId);
        pos.x += force.x * damping;
        pos.y += force.y * damping;
      }
    }
    return positions;
  }
  /**
   * Grid layout (simple uniform spacing)
   */
  gridLayout(options) {
    const positions = /* @__PURE__ */ new Map();
    const spacing = options.spacing || 200;
    const cols = Math.ceil(Math.sqrt(this.nodes.size));
    Array.from(this.nodes.keys()).forEach((nodeId, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      positions.set(nodeId, {
        x: col * spacing + 100,
        y: row * spacing + 100
      });
    });
    return positions;
  }
  /**
   * Calculate arrow points for connecting two elements
   */
  calculateArrowPoints(fromId, toId) {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);
    if (!fromNode || !toNode) {
      return null;
    }
    const startX = fromNode.x + fromNode.width / 2;
    const startY = fromNode.y + fromNode.height / 2;
    const endX = toNode.x + toNode.width / 2;
    const endY = toNode.y + toNode.height / 2;
    return { startX, startY, endX, endY };
  }
};

// scripts/editorCodecs.ts
import { createHash } from "node:crypto";
var MOVE_RECORD = "nimbalystWikiMove";
function asText(content) {
  return typeof content === "string" ? content : new TextDecoder().decode(content);
}
var sha256 = (text) => createHash("sha256").update(text).digest("hex");
function createEditorCodecs(codecs) {
  const byType = new Map(codecs.map((codec) => [codec.documentType, codec]));
  const codecFor = (documentType) => {
    const codec = byType.get(documentType);
    if (!codec) throw new Error(`No editor codec for document type ${documentType}`);
    return codec;
  };
  return {
    documentTypes: [...byType.keys()],
    writeDoc(documentType, doc, fileText, { roomHadState }) {
      const codec = codecFor(documentType);
      const record = doc.getMap(MOVE_RECORD);
      const baseline = record.get("baseline");
      const write2 = (change) => doc.transact(() => {
        change();
        record.set("baseline", sha256(asText(codec.exportToFile(doc))));
      });
      if (baseline === void 0) {
        if (roomHadState || !codec.isEmpty(doc)) return asText(codec.exportToFile(doc)) === fileText ? "unchanged" : "edited";
        write2(() => codec.seedFromFile(doc, fileText));
        return "seeded";
      }
      const current = asText(codec.exportToFile(doc));
      if (sha256(current) !== baseline) return "edited";
      if (current === fileText) return "unchanged";
      write2(() => codec.applyFromFile(doc, fileText));
      return "applied";
    },
    exportDoc(documentType, doc) {
      return asText(codecFor(documentType).exportToFile(doc));
    }
  };
}

// ../extensions/excalidraw/src/collab/excalidrawHelpers.ts
var yjsToExcalidraw = (yArray) => {
  return yArray.toArray().sort((a, b) => {
    const key1 = a.get("pos");
    const key2 = b.get("pos");
    if (key1 !== key2) return key1 > key2 ? 1 : -1;
    const id1 = a.get("el")?.id ?? "";
    const id2 = b.get("el")?.id ?? "";
    return id1 > id2 ? 1 : id1 < id2 ? -1 : 0;
  }).map((x) => x.get("el"));
};

// ../../node_modules/fractional-indexing/src/index.js
var BASE_62_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function midpoint(a, b, digits) {
  const zero = digits[0];
  if (b != null && a >= b) {
    throw new Error(a + " >= " + b);
  }
  if (a.slice(-1) === zero || b && b.slice(-1) === zero) {
    throw new Error("trailing zero");
  }
  if (b) {
    let n = 0;
    while ((a[n] || zero) === b[n]) {
      n++;
    }
    if (n > 0) {
      return b.slice(0, n) + midpoint(a.slice(n), b.slice(n), digits);
    }
  }
  const digitA = a ? digits.indexOf(a[0]) : 0;
  const digitB = b != null ? digits.indexOf(b[0]) : digits.length;
  if (digitB - digitA > 1) {
    const midDigit = Math.round(0.5 * (digitA + digitB));
    return digits[midDigit];
  } else {
    if (b && b.length > 1) {
      return b.slice(0, 1);
    } else {
      return digits[digitA] + midpoint(a.slice(1), null, digits);
    }
  }
}
function validateInteger(int) {
  if (int.length !== getIntegerLength(int[0])) {
    throw new Error("invalid integer part of order key: " + int);
  }
}
function getIntegerLength(head) {
  if (head >= "a" && head <= "z") {
    return head.charCodeAt(0) - "a".charCodeAt(0) + 2;
  } else if (head >= "A" && head <= "Z") {
    return "Z".charCodeAt(0) - head.charCodeAt(0) + 2;
  } else {
    throw new Error("invalid order key head: " + head);
  }
}
function getIntegerPart(key) {
  const integerPartLength = getIntegerLength(key[0]);
  if (integerPartLength > key.length) {
    throw new Error("invalid order key: " + key);
  }
  return key.slice(0, integerPartLength);
}
function validateOrderKey(key, digits) {
  if (key === "A" + digits[0].repeat(26)) {
    throw new Error("invalid order key: " + key);
  }
  const i = getIntegerPart(key);
  const f = key.slice(i.length);
  if (f.slice(-1) === digits[0]) {
    throw new Error("invalid order key: " + key);
  }
}
function incrementInteger(x, digits) {
  validateInteger(x);
  const [head, ...digs] = x.split("");
  let carry = true;
  for (let i = digs.length - 1; carry && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) + 1;
    if (d === digits.length) {
      digs[i] = digits[0];
    } else {
      digs[i] = digits[d];
      carry = false;
    }
  }
  if (carry) {
    if (head === "Z") {
      return "a" + digits[0];
    }
    if (head === "z") {
      return null;
    }
    const h = String.fromCharCode(head.charCodeAt(0) + 1);
    if (h > "a") {
      digs.push(digits[0]);
    } else {
      digs.pop();
    }
    return h + digs.join("");
  } else {
    return head + digs.join("");
  }
}
function decrementInteger(x, digits) {
  validateInteger(x);
  const [head, ...digs] = x.split("");
  let borrow = true;
  for (let i = digs.length - 1; borrow && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) - 1;
    if (d === -1) {
      digs[i] = digits.slice(-1);
    } else {
      digs[i] = digits[d];
      borrow = false;
    }
  }
  if (borrow) {
    if (head === "a") {
      return "Z" + digits.slice(-1);
    }
    if (head === "A") {
      return null;
    }
    const h = String.fromCharCode(head.charCodeAt(0) - 1);
    if (h < "Z") {
      digs.push(digits.slice(-1));
    } else {
      digs.pop();
    }
    return h + digs.join("");
  } else {
    return head + digs.join("");
  }
}
function generateKeyBetween(a, b, digits = BASE_62_DIGITS) {
  if (a != null) {
    validateOrderKey(a, digits);
  }
  if (b != null) {
    validateOrderKey(b, digits);
  }
  if (a != null && b != null && a >= b) {
    throw new Error(a + " >= " + b);
  }
  if (a == null) {
    if (b == null) {
      return "a" + digits[0];
    }
    const ib2 = getIntegerPart(b);
    const fb2 = b.slice(ib2.length);
    if (ib2 === "A" + digits[0].repeat(26)) {
      return ib2 + midpoint("", fb2, digits);
    }
    if (ib2 < b) {
      return ib2;
    }
    const res = decrementInteger(ib2, digits);
    if (res == null) {
      throw new Error("cannot decrement any more");
    }
    return res;
  }
  if (b == null) {
    const ia2 = getIntegerPart(a);
    const fa2 = a.slice(ia2.length);
    const i2 = incrementInteger(ia2, digits);
    return i2 == null ? ia2 + midpoint(fa2, null, digits) : i2;
  }
  const ia = getIntegerPart(a);
  const fa = a.slice(ia.length);
  const ib = getIntegerPart(b);
  const fb = b.slice(ib.length);
  if (ia === ib) {
    return ia + midpoint(fa, fb, digits);
  }
  const i = incrementInteger(ia, digits);
  if (i == null) {
    throw new Error("cannot increment any more");
  }
  if (i < b) {
    return i;
  }
  return ia + midpoint(fa, null, digits);
}
function generateNKeysBetween(a, b, n, digits = BASE_62_DIGITS) {
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [generateKeyBetween(a, b, digits)];
  }
  if (b == null) {
    let c2 = generateKeyBetween(a, b, digits);
    const result = [c2];
    for (let i = 0; i < n - 1; i++) {
      c2 = generateKeyBetween(c2, b, digits);
      result.push(c2);
    }
    return result;
  }
  if (a == null) {
    let c2 = generateKeyBetween(a, b, digits);
    const result = [c2];
    for (let i = 0; i < n - 1; i++) {
      c2 = generateKeyBetween(a, c2, digits);
      result.push(c2);
    }
    result.reverse();
    return result;
  }
  const mid = Math.floor(n / 2);
  const c = generateKeyBetween(a, b, digits);
  return [
    ...generateNKeysBetween(a, c, mid, digits),
    c,
    ...generateNKeysBetween(c, b, n - mid - 1, digits)
  ];
}

// ../../node_modules/lib0/map.js
var create = () => /* @__PURE__ */ new Map();
var copy = (m) => {
  const r = create();
  m.forEach((v, k) => {
    r.set(k, v);
  });
  return r;
};
var setIfUndefined = (map, key, createT) => {
  let set = map.get(key);
  if (set === void 0) {
    map.set(key, set = createT());
  }
  return set;
};
var any = (m, f) => {
  for (const [key, value] of m) {
    if (f(value, key)) {
      return true;
    }
  }
  return false;
};

// ../../node_modules/lib0/set.js
var create2 = () => /* @__PURE__ */ new Set();

// ../../node_modules/lib0/array.js
var last = (arr) => arr[arr.length - 1];
var appendTo = (dest, src) => {
  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
  }
};
var from = Array.from;
var isArray = Array.isArray;

// ../../node_modules/lib0/observable.js
var ObservableV2 = class {
  constructor() {
    this._observers = create();
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  on(name, f) {
    setIfUndefined(
      this._observers,
      /** @type {string} */
      name,
      create2
    ).add(f);
    return f;
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  once(name, f) {
    const _f = (...args2) => {
      this.off(
        name,
        /** @type {any} */
        _f
      );
      f(...args2);
    };
    this.on(
      name,
      /** @type {any} */
      _f
    );
  }
  /**
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name
   * @param {EVENTS[NAME]} f
   */
  off(name, f) {
    const observers = this._observers.get(name);
    if (observers !== void 0) {
      observers.delete(f);
      if (observers.size === 0) {
        this._observers.delete(name);
      }
    }
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @template {keyof EVENTS & string} NAME
   * @param {NAME} name The event name.
   * @param {Parameters<EVENTS[NAME]>} args The arguments that are applied to the event listener.
   */
  emit(name, args2) {
    return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
  }
  destroy() {
    this._observers = create();
  }
};

// ../../node_modules/lib0/math.js
var floor = Math.floor;
var abs = Math.abs;
var min = (a, b) => a < b ? a : b;
var max = (a, b) => a > b ? a : b;
var isNaN = Number.isNaN;
var isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;

// ../../node_modules/lib0/binary.js
var BIT1 = 1;
var BIT2 = 2;
var BIT3 = 4;
var BIT4 = 8;
var BIT6 = 32;
var BIT7 = 64;
var BIT8 = 128;
var BIT18 = 1 << 17;
var BIT19 = 1 << 18;
var BIT20 = 1 << 19;
var BIT21 = 1 << 20;
var BIT22 = 1 << 21;
var BIT23 = 1 << 22;
var BIT24 = 1 << 23;
var BIT25 = 1 << 24;
var BIT26 = 1 << 25;
var BIT27 = 1 << 26;
var BIT28 = 1 << 27;
var BIT29 = 1 << 28;
var BIT30 = 1 << 29;
var BIT31 = 1 << 30;
var BIT32 = 1 << 31;
var BITS5 = 31;
var BITS6 = 63;
var BITS7 = 127;
var BITS17 = BIT18 - 1;
var BITS18 = BIT19 - 1;
var BITS19 = BIT20 - 1;
var BITS20 = BIT21 - 1;
var BITS21 = BIT22 - 1;
var BITS22 = BIT23 - 1;
var BITS23 = BIT24 - 1;
var BITS24 = BIT25 - 1;
var BITS25 = BIT26 - 1;
var BITS26 = BIT27 - 1;
var BITS27 = BIT28 - 1;
var BITS28 = BIT29 - 1;
var BITS29 = BIT30 - 1;
var BITS30 = BIT31 - 1;
var BITS31 = 2147483647;

// ../../node_modules/lib0/number.js
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
var LOWEST_INT32 = 1 << 31;
var isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
var isNaN2 = Number.isNaN;
var parseInt = Number.parseInt;

// ../../node_modules/lib0/string.js
var fromCharCode = String.fromCharCode;
var fromCodePoint = String.fromCodePoint;
var MAX_UTF16_CHARACTER = fromCharCode(65535);
var toLowerCase = (s) => s.toLowerCase();
var trimLeftRegex = /^\s*/g;
var trimLeft = (s) => s.replace(trimLeftRegex, "");
var fromCamelCaseRegex = /([A-Z])/g;
var fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match) => `${separator}${toLowerCase(match)}`));
var _encodeUtf8Polyfill = (str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  const buf = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buf[i] = /** @type {number} */
    encodedString.codePointAt(i);
  }
  return buf;
};
var utf8TextEncoder = (
  /** @type {TextEncoder} */
  typeof TextEncoder !== "undefined" ? new TextEncoder() : null
);
var _encodeUtf8Native = (str) => utf8TextEncoder.encode(str);
var encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;
var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  utf8TextDecoder = null;
}

// ../../node_modules/lib0/encoding.js
var Encoder = class {
  constructor() {
    this.cpos = 0;
    this.cbuf = new Uint8Array(100);
    this.bufs = [];
  }
};
var createEncoder = () => new Encoder();
var length = (encoder) => {
  let len = encoder.cpos;
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length;
  }
  return len;
};
var toUint8Array = (encoder) => {
  const uint8arr = new Uint8Array(length(encoder));
  let curPos = 0;
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i];
    uint8arr.set(d, curPos);
    curPos += d.length;
  }
  uint8arr.set(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
  return uint8arr;
};
var verifyLen = (encoder, len) => {
  const bufferLen = encoder.cbuf.length;
  if (bufferLen - encoder.cpos < len) {
    encoder.bufs.push(new Uint8Array(encoder.cbuf.buffer, 0, encoder.cpos));
    encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
    encoder.cpos = 0;
  }
};
var write = (encoder, num) => {
  const bufferLen = encoder.cbuf.length;
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(bufferLen * 2);
    encoder.cpos = 0;
  }
  encoder.cbuf[encoder.cpos++] = num;
};
var writeUint8 = write;
var writeVarUint = (encoder, num) => {
  while (num > BITS7) {
    write(encoder, BIT8 | BITS7 & num);
    num = floor(num / 128);
  }
  write(encoder, BITS7 & num);
};
var writeVarInt = (encoder, num) => {
  const isNegative = isNegativeZero(num);
  if (isNegative) {
    num = -num;
  }
  write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
  num = floor(num / 64);
  while (num > 0) {
    write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
    num = floor(num / 128);
  }
};
var _strBuffer = new Uint8Array(3e4);
var _maxStrBSize = _strBuffer.length / 3;
var _writeVarStringNative = (encoder, str) => {
  if (str.length < _maxStrBSize) {
    const written = utf8TextEncoder.encodeInto(str, _strBuffer).written || 0;
    writeVarUint(encoder, written);
    for (let i = 0; i < written; i++) {
      write(encoder, _strBuffer[i]);
    }
  } else {
    writeVarUint8Array(encoder, encodeUtf8(str));
  }
};
var _writeVarStringPolyfill = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str));
  const len = encodedString.length;
  writeVarUint(encoder, len);
  for (let i = 0; i < len; i++) {
    write(
      encoder,
      /** @type {number} */
      encodedString.codePointAt(i)
    );
  }
};
var writeVarString = utf8TextEncoder && /** @type {any} */
utf8TextEncoder.encodeInto ? _writeVarStringNative : _writeVarStringPolyfill;
var writeUint8Array = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length;
  const cpos = encoder.cpos;
  const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
  const rightCopyLen = uint8Array.length - leftCopyLen;
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
  encoder.cpos += leftCopyLen;
  if (rightCopyLen > 0) {
    encoder.bufs.push(encoder.cbuf);
    encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
    encoder.cpos = rightCopyLen;
  }
};
var writeVarUint8Array = (encoder, uint8Array) => {
  writeVarUint(encoder, uint8Array.byteLength);
  writeUint8Array(encoder, uint8Array);
};
var writeOnDataView = (encoder, len) => {
  verifyLen(encoder, len);
  const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
  encoder.cpos += len;
  return dview;
};
var writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
var writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
var writeBigInt64 = (encoder, num) => (
  /** @type {any} */
  writeOnDataView(encoder, 8).setBigInt64(0, num, false)
);
var floatTestBed = new DataView(new ArrayBuffer(4));
var isFloat32 = (num) => {
  floatTestBed.setFloat32(0, num);
  return floatTestBed.getFloat32(0) === num;
};
var writeAny = (encoder, data) => {
  switch (typeof data) {
    case "string":
      write(encoder, 119);
      writeVarString(encoder, data);
      break;
    case "number":
      if (isInteger(data) && abs(data) <= BITS31) {
        write(encoder, 125);
        writeVarInt(encoder, data);
      } else if (isFloat32(data)) {
        write(encoder, 124);
        writeFloat32(encoder, data);
      } else {
        write(encoder, 123);
        writeFloat64(encoder, data);
      }
      break;
    case "bigint":
      write(encoder, 122);
      writeBigInt64(encoder, data);
      break;
    case "object":
      if (data === null) {
        write(encoder, 126);
      } else if (isArray(data)) {
        write(encoder, 117);
        writeVarUint(encoder, data.length);
        for (let i = 0; i < data.length; i++) {
          writeAny(encoder, data[i]);
        }
      } else if (data instanceof Uint8Array) {
        write(encoder, 116);
        writeVarUint8Array(encoder, data);
      } else {
        write(encoder, 118);
        const keys2 = Object.keys(data);
        writeVarUint(encoder, keys2.length);
        for (let i = 0; i < keys2.length; i++) {
          const key = keys2[i];
          writeVarString(encoder, key);
          writeAny(encoder, data[key]);
        }
      }
      break;
    case "boolean":
      write(encoder, data ? 120 : 121);
      break;
    default:
      write(encoder, 127);
  }
};
var RleEncoder = class extends Encoder {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor(writer) {
    super();
    this.w = writer;
    this.s = null;
    this.count = 0;
  }
  /**
   * @param {T} v
   */
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      if (this.count > 0) {
        writeVarUint(this, this.count - 1);
      }
      this.count = 1;
      this.w(this, v);
      this.s = v;
    }
  }
};
var flushUintOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
var UintOptRleEncoder = class {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
  }
  /**
   * @param {number} v
   */
  write(v) {
    if (this.s === v) {
      this.count++;
    } else {
      flushUintOptRleEncoder(this);
      this.count = 1;
      this.s = v;
    }
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    flushUintOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
};
var flushIntDiffOptRleEncoder = (encoder) => {
  if (encoder.count > 0) {
    const encodedDiff = encoder.diff * 2 + (encoder.count === 1 ? 0 : 1);
    writeVarInt(encoder.encoder, encodedDiff);
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2);
    }
  }
};
var IntDiffOptRleEncoder = class {
  constructor() {
    this.encoder = new Encoder();
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }
  /**
   * @param {number} v
   */
  write(v) {
    if (this.diff === v - this.s) {
      this.s = v;
      this.count++;
    } else {
      flushIntDiffOptRleEncoder(this);
      this.count = 1;
      this.diff = v - this.s;
      this.s = v;
    }
  }
  /**
   * Flush the encoded state and transform this to a Uint8Array.
   *
   * Note that this should only be called once.
   */
  toUint8Array() {
    flushIntDiffOptRleEncoder(this);
    return toUint8Array(this.encoder);
  }
};
var StringEncoder = class {
  constructor() {
    this.sarr = [];
    this.s = "";
    this.lensE = new UintOptRleEncoder();
  }
  /**
   * @param {string} string
   */
  write(string) {
    this.s += string;
    if (this.s.length > 19) {
      this.sarr.push(this.s);
      this.s = "";
    }
    this.lensE.write(string.length);
  }
  toUint8Array() {
    const encoder = new Encoder();
    this.sarr.push(this.s);
    this.s = "";
    writeVarString(encoder, this.sarr.join(""));
    writeUint8Array(encoder, this.lensE.toUint8Array());
    return toUint8Array(encoder);
  }
};

// ../../node_modules/lib0/error.js
var create3 = (s) => new Error(s);
var methodUnimplemented = () => {
  throw create3("Method unimplemented");
};
var unexpectedCase = () => {
  throw create3("Unexpected case");
};

// ../../node_modules/lib0/decoding.js
var errorUnexpectedEndOfArray = create3("Unexpected end of array");
var errorIntegerOutOfRange = create3("Integer out of Range");
var Decoder = class {
  /**
   * @param {Uint8Array<Buf>} uint8Array Binary data to decode
   */
  constructor(uint8Array) {
    this.arr = uint8Array;
    this.pos = 0;
  }
};
var createDecoder = (uint8Array) => new Decoder(uint8Array);
var hasContent = (decoder) => decoder.pos !== decoder.arr.length;
var readUint8Array = (decoder, len) => {
  const view = new Uint8Array(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
  decoder.pos += len;
  return view;
};
var readVarUint8Array = (decoder) => readUint8Array(decoder, readVarUint(decoder));
var readUint8 = (decoder) => decoder.arr[decoder.pos++];
var readVarUint = (decoder) => {
  let num = 0;
  let mult = 1;
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    const r = decoder.arr[decoder.pos++];
    num = num + (r & BITS7) * mult;
    mult *= 128;
    if (r < BIT8) {
      return num;
    }
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange;
    }
  }
  throw errorUnexpectedEndOfArray;
};
var readVarInt = (decoder) => {
  let r = decoder.arr[decoder.pos++];
  let num = r & BITS6;
  let mult = 64;
  const sign = (r & BIT7) > 0 ? -1 : 1;
  if ((r & BIT8) === 0) {
    return sign * num;
  }
  const len = decoder.arr.length;
  while (decoder.pos < len) {
    r = decoder.arr[decoder.pos++];
    num = num + (r & BITS7) * mult;
    mult *= 128;
    if (r < BIT8) {
      return sign * num;
    }
    if (num > MAX_SAFE_INTEGER) {
      throw errorIntegerOutOfRange;
    }
  }
  throw errorUnexpectedEndOfArray;
};
var _readVarStringPolyfill = (decoder) => {
  let remainingLen = readVarUint(decoder);
  if (remainingLen === 0) {
    return "";
  } else {
    let encodedString = String.fromCodePoint(readUint8(decoder));
    if (--remainingLen < 100) {
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8(decoder));
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 1e4 ? remainingLen : 1e4;
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
        decoder.pos += nextLen;
        encodedString += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          bytes
        );
        remainingLen -= nextLen;
      }
    }
    return decodeURIComponent(escape(encodedString));
  }
};
var _readVarStringNative = (decoder) => (
  /** @type any */
  utf8TextDecoder.decode(readVarUint8Array(decoder))
);
var readVarString = utf8TextDecoder ? _readVarStringNative : _readVarStringPolyfill;
var readFromDataView = (decoder, len) => {
  const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
  decoder.pos += len;
  return dv;
};
var readFloat32 = (decoder) => readFromDataView(decoder, 4).getFloat32(0, false);
var readFloat64 = (decoder) => readFromDataView(decoder, 8).getFloat64(0, false);
var readBigInt64 = (decoder) => (
  /** @type {any} */
  readFromDataView(decoder, 8).getBigInt64(0, false)
);
var readAnyLookupTable = [
  (decoder) => void 0,
  // CASE 127: undefined
  (decoder) => null,
  // CASE 126: null
  readVarInt,
  // CASE 125: integer
  readFloat32,
  // CASE 124: float32
  readFloat64,
  // CASE 123: float64
  readBigInt64,
  // CASE 122: bigint
  (decoder) => false,
  // CASE 121: boolean (false)
  (decoder) => true,
  // CASE 120: boolean (true)
  readVarString,
  // CASE 119: string
  (decoder) => {
    const len = readVarUint(decoder);
    const obj = {};
    for (let i = 0; i < len; i++) {
      const key = readVarString(decoder);
      obj[key] = readAny(decoder);
    }
    return obj;
  },
  (decoder) => {
    const len = readVarUint(decoder);
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(readAny(decoder));
    }
    return arr;
  },
  readVarUint8Array
  // CASE 116: Uint8Array
];
var readAny = (decoder) => readAnyLookupTable[127 - readUint8(decoder)](decoder);
var RleDecoder = class extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor(uint8Array, reader) {
    super(uint8Array);
    this.reader = reader;
    this.s = null;
    this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = this.reader(this);
      if (hasContent(this)) {
        this.count = readVarUint(this) + 1;
      } else {
        this.count = -1;
      }
    }
    this.count--;
    return (
      /** @type {T} */
      this.s
    );
  }
};
var UintOptRleDecoder = class extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(uint8Array) {
    super(uint8Array);
    this.s = 0;
    this.count = 0;
  }
  read() {
    if (this.count === 0) {
      this.s = readVarInt(this);
      const isNegative = isNegativeZero(this.s);
      this.count = 1;
      if (isNegative) {
        this.s = -this.s;
        this.count = readVarUint(this) + 2;
      }
    }
    this.count--;
    return (
      /** @type {number} */
      this.s
    );
  }
};
var IntDiffOptRleDecoder = class extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(uint8Array) {
    super(uint8Array);
    this.s = 0;
    this.count = 0;
    this.diff = 0;
  }
  /**
   * @return {number}
   */
  read() {
    if (this.count === 0) {
      const diff = readVarInt(this);
      const hasCount = diff & 1;
      this.diff = floor(diff / 2);
      this.count = 1;
      if (hasCount) {
        this.count = readVarUint(this) + 2;
      }
    }
    this.s += this.diff;
    this.count--;
    return this.s;
  }
};
var StringDecoder = class {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor(uint8Array) {
    this.decoder = new UintOptRleDecoder(uint8Array);
    this.str = readVarString(this.decoder);
    this.spos = 0;
  }
  /**
   * @return {string}
   */
  read() {
    const end = this.spos + this.decoder.read();
    const res = this.str.slice(this.spos, end);
    this.spos = end;
    return res;
  }
};

// ../../node_modules/lib0/webcrypto.node.js
import { webcrypto } from "node:crypto";
var subtle = (
  /** @type {any} */
  webcrypto.subtle
);
var getRandomValues = (
  /** @type {any} */
  webcrypto.getRandomValues.bind(webcrypto)
);

// ../../node_modules/lib0/random.js
var uint32 = () => getRandomValues(new Uint32Array(1))[0];
var uuidv4Template = "10000000-1000-4000-8000" + -1e11;
var uuidv4 = () => uuidv4Template.replace(
  /[018]/g,
  /** @param {number} c */
  (c) => (c ^ uint32() & 15 >> c / 4).toString(16)
);

// ../../node_modules/lib0/time.js
var getUnixTime = Date.now;

// ../../node_modules/lib0/promise.js
var create4 = (f) => (
  /** @type {Promise<T>} */
  new Promise(f)
);
var all = Promise.all.bind(Promise);

// ../../node_modules/lib0/conditions.js
var undefinedToNull = (v) => v === void 0 ? null : v;

// ../../node_modules/lib0/storage.js
var VarStoragePolyfill = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(key, newValue) {
    this.map.set(key, newValue);
  }
  /**
   * @param {string} key
   */
  getItem(key) {
    return this.map.get(key);
  }
};
var _localStorage = new VarStoragePolyfill();
var usePolyfill = true;
try {
  if (typeof localStorage !== "undefined" && localStorage) {
    _localStorage = localStorage;
    usePolyfill = false;
  }
} catch (e) {
}
var varStorage = _localStorage;

// ../../node_modules/lib0/trait/equality.js
var EqualityTraitSymbol = /* @__PURE__ */ Symbol("Equality");
var equals = (a, b) => a === b || !!a?.[EqualityTraitSymbol]?.(b) || false;

// ../../node_modules/lib0/object.js
var assign = Object.assign;
var keys = Object.keys;
var forEach = (obj, f) => {
  for (const key in obj) {
    f(obj[key], key);
  }
};
var size = (obj) => keys(obj).length;
var isEmpty = (obj) => {
  for (const _k in obj) {
    return false;
  }
  return true;
};
var every = (obj, f) => {
  for (const key in obj) {
    if (!f(obj[key], key)) {
      return false;
    }
  }
  return true;
};
var hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
var equalFlat = (a, b) => a === b || size(a) === size(b) && every(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && equals(b[key], val));
var freeze = Object.freeze;
var deepFreeze = (o) => {
  for (const key in o) {
    const c = o[key];
    if (typeof c === "object" || typeof c === "function") {
      deepFreeze(o[key]);
    }
  }
  return freeze(o);
};

// ../../node_modules/lib0/function.js
var callAll = (fs, args2, i = 0) => {
  try {
    for (; i < fs.length; i++) {
      fs[i](...args2);
    }
  } finally {
    if (i < fs.length) {
      callAll(fs, args2, i + 1);
    }
  }
};
var id = (a) => a;
var isOneOf = (value, options) => options.includes(value);

// ../../node_modules/lib0/environment.js
var isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
var isMac = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
var params;
var args = [];
var computeParams = () => {
  if (params === void 0) {
    if (isNode) {
      params = create();
      const pargs = process.argv;
      let currParamName = null;
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i];
        if (parg[0] === "-") {
          if (currParamName !== null) {
            params.set(currParamName, "");
          }
          currParamName = parg;
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg);
            currParamName = null;
          } else {
            args.push(parg);
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, "");
      }
    } else if (typeof location === "object") {
      params = create();
      (location.search || "?").slice(1).split("&").forEach((kv) => {
        if (kv.length !== 0) {
          const [key, value] = kv.split("=");
          params.set(`--${fromCamelCase(key, "-")}`, value);
          params.set(`-${fromCamelCase(key, "-")}`, value);
        }
      });
    } else {
      params = create();
    }
  }
  return params;
};
var hasParam = (name) => computeParams().has(name);
var getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase().replaceAll("-", "_")]) : undefinedToNull(varStorage.getItem(name));
var hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
var production = hasConf("production");
var forceColor = isNode && isOneOf(process.env.FORCE_COLOR, ["true", "1", "2"]);
var supportsColor = forceColor || !hasParam("--no-colors") && // @todo deprecate --no-colors
!hasConf("no-color") && (!isNode || process.stdout.isTTY) && (!isNode || hasParam("--color") || getVariable("COLORTERM") !== null || (getVariable("TERM") || "").includes("color"));

// ../../node_modules/lib0/buffer.js
var createUint8ArrayFromLen = (len) => new Uint8Array(len);
var copyUint8Array = (uint8Array) => {
  const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
  newBuf.set(uint8Array);
  return newBuf;
};

// ../../node_modules/lib0/symbol.js
var create5 = Symbol;

// ../../node_modules/lib0/logging.common.js
var BOLD = create5();
var UNBOLD = create5();
var BLUE = create5();
var GREY = create5();
var GREEN = create5();
var RED = create5();
var PURPLE = create5();
var ORANGE = create5();
var UNCOLOR = create5();
var computeNoColorLoggingArgs = (args2) => {
  if (args2.length === 1 && args2[0]?.constructor === Function) {
    args2 = /** @type {Array<string|Symbol|Object|number>} */
    /** @type {[function]} */
    args2[0]();
  }
  const strBuilder = [];
  const logArgs = [];
  let i = 0;
  for (; i < args2.length; i++) {
    const arg = args2[i];
    if (arg === void 0) {
      break;
    } else if (arg.constructor === String || arg.constructor === Number) {
      strBuilder.push(arg);
    } else if (arg.constructor === Object) {
      break;
    }
  }
  if (i > 0) {
    logArgs.push(strBuilder.join(""));
  }
  for (; i < args2.length; i++) {
    const arg = args2[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs;
};
var lastLoggingTime = getUnixTime();

// ../../node_modules/lib0/logging.node.js
var _nodeStyleMap = {
  [BOLD]: "\x1B[1m",
  [UNBOLD]: "\x1B[2m",
  [BLUE]: "\x1B[34m",
  [GREEN]: "\x1B[32m",
  [GREY]: "\x1B[37m",
  [RED]: "\x1B[31m",
  [PURPLE]: "\x1B[35m",
  [ORANGE]: "\x1B[38;5;208m",
  [UNCOLOR]: "\x1B[0m"
};
var computeNodeLoggingArgs = (args2) => {
  if (args2.length === 1 && args2[0]?.constructor === Function) {
    args2 = /** @type {Array<string|Symbol|Object|number>} */
    /** @type {[function]} */
    args2[0]();
  }
  const strBuilder = [];
  const logArgs = [];
  let i = 0;
  for (; i < args2.length; i++) {
    const arg = args2[i];
    const style = _nodeStyleMap[arg];
    if (style !== void 0) {
      strBuilder.push(style);
    } else {
      if (arg === void 0) {
        break;
      } else if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg);
      } else {
        break;
      }
    }
  }
  if (i > 0) {
    strBuilder.push("\x1B[0m");
    logArgs.push(strBuilder.join(""));
  }
  for (; i < args2.length; i++) {
    const arg = args2[i];
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg);
    }
  }
  return logArgs;
};
var computeLoggingArgs = supportsColor ? computeNodeLoggingArgs : computeNoColorLoggingArgs;
var print = (...args2) => {
  console.log(...computeLoggingArgs(args2));
};
var warn = (...args2) => {
  console.warn(...computeLoggingArgs(args2));
};

// ../../node_modules/lib0/iterator.js
var createIterator = (next) => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return this;
  },
  // @ts-ignore
  next
});
var iteratorFilter = (iterator, filter) => createIterator(() => {
  let res;
  do {
    res = iterator.next();
  } while (!res.done && !filter(res.value));
  return res;
});
var iteratorMap = (iterator, fmap) => createIterator(() => {
  const { done, value } = iterator.next();
  return { done, value: done ? void 0 : fmap(value) };
});

// ../../node_modules/yjs/dist/yjs.mjs
var DeleteItem = class {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor(clock, len) {
    this.clock = clock;
    this.len = len;
  }
};
var DeleteSet = class {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
  }
};
var iterateDeletedStructs = (transaction, ds, f) => ds.clients.forEach((deletes, clientid) => {
  const structs = (
    /** @type {Array<GC|Item>} */
    transaction.doc.store.clients.get(clientid)
  );
  if (structs != null) {
    const lastStruct = structs[structs.length - 1];
    const clockState = lastStruct.id.clock + lastStruct.length;
    for (let i = 0, del = deletes[i]; i < deletes.length && del.clock < clockState; del = deletes[++i]) {
      iterateStructs(transaction, structs, del.clock, del.len, f);
    }
  }
});
var findIndexDS = (dis, clock) => {
  let left = 0;
  let right = dis.length - 1;
  while (left <= right) {
    const midindex = floor((left + right) / 2);
    const mid = dis[midindex];
    const midclock = mid.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.len) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
  }
  return null;
};
var isDeleted = (ds, id2) => {
  const dis = ds.clients.get(id2.client);
  return dis !== void 0 && findIndexDS(dis, id2.clock) !== null;
};
var sortAndMergeDeleteSet = (ds) => {
  ds.clients.forEach((dels) => {
    dels.sort((a, b) => a.clock - b.clock);
    let i, j;
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1];
      const right = dels[i];
      if (left.clock + left.len >= right.clock) {
        dels[j - 1] = new DeleteItem(left.clock, max(left.len, right.clock + right.len - left.clock));
      } else {
        if (j < i) {
          dels[j] = right;
        }
        j++;
      }
    }
    dels.length = j;
  });
};
var mergeDeleteSets = (dss) => {
  const merged = new DeleteSet();
  for (let dssI = 0; dssI < dss.length; dssI++) {
    dss[dssI].clients.forEach((delsLeft, client) => {
      if (!merged.clients.has(client)) {
        const dels = delsLeft.slice();
        for (let i = dssI + 1; i < dss.length; i++) {
          appendTo(dels, dss[i].clients.get(client) || []);
        }
        merged.clients.set(client, dels);
      }
    });
  }
  sortAndMergeDeleteSet(merged);
  return merged;
};
var addToDeleteSet = (ds, client, clock, length2) => {
  setIfUndefined(ds.clients, client, () => (
    /** @type {Array<DeleteItem>} */
    []
  )).push(new DeleteItem(clock, length2));
};
var createDeleteSet = () => new DeleteSet();
var createDeleteSetFromStructStore = (ss) => {
  const ds = createDeleteSet();
  ss.clients.forEach((structs, client) => {
    const dsitems = [];
    for (let i = 0; i < structs.length; i++) {
      const struct = structs[i];
      if (struct.deleted) {
        const clock = struct.id.clock;
        let len = struct.length;
        if (i + 1 < structs.length) {
          for (let next = structs[i + 1]; i + 1 < structs.length && next.deleted; next = structs[++i + 1]) {
            len += next.length;
          }
        }
        dsitems.push(new DeleteItem(clock, len));
      }
    }
    if (dsitems.length > 0) {
      ds.clients.set(client, dsitems);
    }
  });
  return ds;
};
var writeDeleteSet = (encoder, ds) => {
  writeVarUint(encoder.restEncoder, ds.clients.size);
  from(ds.clients.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, dsitems]) => {
    encoder.resetDsCurVal();
    writeVarUint(encoder.restEncoder, client);
    const len = dsitems.length;
    writeVarUint(encoder.restEncoder, len);
    for (let i = 0; i < len; i++) {
      const item = dsitems[i];
      encoder.writeDsClock(item.clock);
      encoder.writeDsLen(item.len);
    }
  });
};
var readDeleteSet = (decoder) => {
  const ds = new DeleteSet();
  const numClients = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint(decoder.restDecoder);
    const numberOfDeletes = readVarUint(decoder.restDecoder);
    if (numberOfDeletes > 0) {
      const dsField = setIfUndefined(ds.clients, client, () => (
        /** @type {Array<DeleteItem>} */
        []
      ));
      for (let i2 = 0; i2 < numberOfDeletes; i2++) {
        dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
      }
    }
  }
  return ds;
};
var readAndApplyDeleteSet = (decoder, transaction, store) => {
  const unappliedDS = new DeleteSet();
  const numClients = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = readVarUint(decoder.restDecoder);
    const numberOfDeletes = readVarUint(decoder.restDecoder);
    const structs = store.clients.get(client) || [];
    const state = getState(store, client);
    for (let i2 = 0; i2 < numberOfDeletes; i2++) {
      const clock = decoder.readDsClock();
      const clockEnd = clock + decoder.readDsLen();
      if (clock < state) {
        if (state < clockEnd) {
          addToDeleteSet(unappliedDS, client, state, clockEnd - state);
        }
        let index = findIndexSS(structs, clock);
        let struct = structs[index];
        if (!struct.deleted && struct.id.clock < clock) {
          structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
          index++;
        }
        while (index < structs.length) {
          struct = structs[index++];
          if (struct.id.clock < clockEnd) {
            if (!struct.deleted) {
              if (clockEnd < struct.id.clock + struct.length) {
                structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
              }
              struct.delete(transaction);
            }
          } else {
            break;
          }
        }
      } else {
        addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
      }
    }
  }
  if (unappliedDS.clients.size > 0) {
    const ds = new UpdateEncoderV2();
    writeVarUint(ds.restEncoder, 0);
    writeDeleteSet(ds, unappliedDS);
    return ds.toUint8Array();
  }
  return null;
};
var generateNewClientId = uint32;
var Doc = class _Doc extends ObservableV2 {
  /**
   * @param {DocOpts} opts configuration
   */
  constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
    super();
    this.gc = gc;
    this.gcFilter = gcFilter;
    this.clientID = generateNewClientId();
    this.guid = guid;
    this.collectionid = collectionid;
    this.share = /* @__PURE__ */ new Map();
    this.store = new StructStore();
    this._transaction = null;
    this._transactionCleanups = [];
    this.subdocs = /* @__PURE__ */ new Set();
    this._item = null;
    this.shouldLoad = shouldLoad;
    this.autoLoad = autoLoad;
    this.meta = meta;
    this.isLoaded = false;
    this.isSynced = false;
    this.isDestroyed = false;
    this.whenLoaded = create4((resolve) => {
      this.on("load", () => {
        this.isLoaded = true;
        resolve(this);
      });
    });
    const provideSyncedPromise = () => create4((resolve) => {
      const eventHandler = (isSynced) => {
        if (isSynced === void 0 || isSynced === true) {
          this.off("sync", eventHandler);
          resolve();
        }
      };
      this.on("sync", eventHandler);
    });
    this.on("sync", (isSynced) => {
      if (isSynced === false && this.isSynced) {
        this.whenSynced = provideSyncedPromise();
      }
      this.isSynced = isSynced === void 0 || isSynced === true;
      if (this.isSynced && !this.isLoaded) {
        this.emit("load", [this]);
      }
    });
    this.whenSynced = provideSyncedPromise();
  }
  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load() {
    const item = this._item;
    if (item !== null && !this.shouldLoad) {
      transact(
        /** @type {any} */
        item.parent.doc,
        (transaction) => {
          transaction.subdocsLoaded.add(this);
        },
        null,
        true
      );
    }
    this.shouldLoad = true;
  }
  getSubdocs() {
    return this.subdocs;
  }
  getSubdocGuids() {
    return new Set(from(this.subdocs).map((doc) => doc.guid));
  }
  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @template T
   * @param {function(Transaction):T} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   * @return T
   *
   * @public
   */
  transact(f, origin = null) {
    return transact(this, f, origin);
  }
  /**
   * Define a shared data type.
   *
   * Multiple calls of `ydoc.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `ydoc.get(name, Y.Array) === ydoc.get(name, Y.Array)`
   *
   * After this method is called, the type is also available on `ydoc.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Y.Doc instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @template {typeof AbstractType<any>} Type
   * @example
   *   const ydoc = new Y.Doc(..)
   *   const appState = {
   *     document: ydoc.getText('document')
   *     comments: ydoc.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Type} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {InstanceType<Type>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get(name, TypeConstructor = (
    /** @type {any} */
    AbstractType
  )) {
    const type = setIfUndefined(this.share, name, () => {
      const t = new TypeConstructor();
      t._integrate(this, null);
      return t;
    });
    const Constr = type.constructor;
    if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
      if (Constr === AbstractType) {
        const t = new TypeConstructor();
        t._map = type._map;
        type._map.forEach(
          /** @param {Item?} n */
          (n) => {
            for (; n !== null; n = n.left) {
              n.parent = t;
            }
          }
        );
        t._start = type._start;
        for (let n = t._start; n !== null; n = n.right) {
          n.parent = t;
        }
        t._length = type._length;
        this.share.set(name, t);
        t._integrate(this, null);
        return (
          /** @type {InstanceType<Type>} */
          t
        );
      } else {
        throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
      }
    }
    return (
      /** @type {InstanceType<Type>} */
      type
    );
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray(name = "") {
    return (
      /** @type {YArray<T>} */
      this.get(name, YArray)
    );
  }
  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText(name = "") {
    return this.get(name, YText);
  }
  /**
   * @template T
   * @param {string} [name]
   * @return {YMap<T>}
   *
   * @public
   */
  getMap(name = "") {
    return (
      /** @type {YMap<T>} */
      this.get(name, YMap)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlElement}
   *
   * @public
   */
  getXmlElement(name = "") {
    return (
      /** @type {YXmlElement<{[key:string]:string}>} */
      this.get(name, YXmlElement)
    );
  }
  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment(name = "") {
    return this.get(name, YXmlFragment);
  }
  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON() {
    const doc = {};
    this.share.forEach((value, key) => {
      doc[key] = value.toJSON();
    });
    return doc;
  }
  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy() {
    this.isDestroyed = true;
    from(this.subdocs).forEach((subdoc) => subdoc.destroy());
    const item = this._item;
    if (item !== null) {
      this._item = null;
      const content = (
        /** @type {ContentDoc} */
        item.content
      );
      content.doc = new _Doc({ guid: this.guid, ...content.opts, shouldLoad: false });
      content.doc._item = item;
      transact(
        /** @type {any} */
        item.parent.doc,
        (transaction) => {
          const doc = content.doc;
          if (!item.deleted) {
            transaction.subdocsAdded.add(doc);
          }
          transaction.subdocsRemoved.add(this);
        },
        null,
        true
      );
    }
    this.emit("destroyed", [true]);
    this.emit("destroy", [this]);
    super.destroy();
  }
};
var DSDecoderV1 = class {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(decoder) {
    this.restDecoder = decoder;
  }
  resetDsCurVal() {
  }
  /**
   * @return {number}
   */
  readDsClock() {
    return readVarUint(this.restDecoder);
  }
  /**
   * @return {number}
   */
  readDsLen() {
    return readVarUint(this.restDecoder);
  }
};
var UpdateDecoderV1 = class extends DSDecoderV1 {
  /**
   * @return {ID}
   */
  readLeftID() {
    return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return createID(readVarUint(this.restDecoder), readVarUint(this.restDecoder));
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return readVarUint(this.restDecoder);
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return readUint8(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readString() {
    return readVarString(this.restDecoder);
  }
  /**
   * @return {boolean} isKey
   */
  readParentInfo() {
    return readVarUint(this.restDecoder) === 1;
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef() {
    return readVarUint(this.restDecoder);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen() {
    return readVarUint(this.restDecoder);
  }
  /**
   * @return {any}
   */
  readAny() {
    return readAny(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return copyUint8Array(readVarUint8Array(this.restDecoder));
  }
  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON() {
    return JSON.parse(readVarString(this.restDecoder));
  }
  /**
   * @return {string}
   */
  readKey() {
    return readVarString(this.restDecoder);
  }
};
var DSDecoderV2 = class {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(decoder) {
    this.dsCurrVal = 0;
    this.restDecoder = decoder;
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @return {number}
   */
  readDsClock() {
    this.dsCurrVal += readVarUint(this.restDecoder);
    return this.dsCurrVal;
  }
  /**
   * @return {number}
   */
  readDsLen() {
    const diff = readVarUint(this.restDecoder) + 1;
    this.dsCurrVal += diff;
    return diff;
  }
};
var UpdateDecoderV2 = class extends DSDecoderV2 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor(decoder) {
    super(decoder);
    this.keys = [];
    readVarUint(decoder);
    this.keyClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.clientDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    this.leftClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.rightClockDecoder = new IntDiffOptRleDecoder(readVarUint8Array(decoder));
    this.infoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
    this.stringDecoder = new StringDecoder(readVarUint8Array(decoder));
    this.parentInfoDecoder = new RleDecoder(readVarUint8Array(decoder), readUint8);
    this.typeRefDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
    this.lenDecoder = new UintOptRleDecoder(readVarUint8Array(decoder));
  }
  /**
   * @return {ID}
   */
  readLeftID() {
    return new ID(this.clientDecoder.read(), this.leftClockDecoder.read());
  }
  /**
   * @return {ID}
   */
  readRightID() {
    return new ID(this.clientDecoder.read(), this.rightClockDecoder.read());
  }
  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient() {
    return this.clientDecoder.read();
  }
  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo() {
    return (
      /** @type {number} */
      this.infoDecoder.read()
    );
  }
  /**
   * @return {string}
   */
  readString() {
    return this.stringDecoder.read();
  }
  /**
   * @return {boolean}
   */
  readParentInfo() {
    return this.parentInfoDecoder.read() === 1;
  }
  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef() {
    return this.typeRefDecoder.read();
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen() {
    return this.lenDecoder.read();
  }
  /**
   * @return {any}
   */
  readAny() {
    return readAny(this.restDecoder);
  }
  /**
   * @return {Uint8Array}
   */
  readBuf() {
    return readVarUint8Array(this.restDecoder);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON() {
    return readAny(this.restDecoder);
  }
  /**
   * @return {string}
   */
  readKey() {
    const keyClock = this.keyClockDecoder.read();
    if (keyClock < this.keys.length) {
      return this.keys[keyClock];
    } else {
      const key = this.stringDecoder.read();
      this.keys.push(key);
      return key;
    }
  }
};
var DSEncoderV1 = class {
  constructor() {
    this.restEncoder = createEncoder();
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
  }
  /**
   * @param {number} clock
   */
  writeDsClock(clock) {
    writeVarUint(this.restEncoder, clock);
  }
  /**
   * @param {number} len
   */
  writeDsLen(len) {
    writeVarUint(this.restEncoder, len);
  }
};
var UpdateEncoderV1 = class extends DSEncoderV1 {
  /**
   * @param {ID} id
   */
  writeLeftID(id2) {
    writeVarUint(this.restEncoder, id2.client);
    writeVarUint(this.restEncoder, id2.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(id2) {
    writeVarUint(this.restEncoder, id2.client);
    writeVarUint(this.restEncoder, id2.clock);
  }
  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient(client) {
    writeVarUint(this.restEncoder, client);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(info) {
    writeUint8(this.restEncoder, info);
  }
  /**
   * @param {string} s
   */
  writeString(s) {
    writeVarString(this.restEncoder, s);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(isYKey) {
    writeVarUint(this.restEncoder, isYKey ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(info) {
    writeVarUint(this.restEncoder, info);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(len) {
    writeVarUint(this.restEncoder, len);
  }
  /**
   * @param {any} any
   */
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  /**
   * @param {any} embed
   */
  writeJSON(embed) {
    writeVarString(this.restEncoder, JSON.stringify(embed));
  }
  /**
   * @param {string} key
   */
  writeKey(key) {
    writeVarString(this.restEncoder, key);
  }
};
var DSEncoderV2 = class {
  constructor() {
    this.restEncoder = createEncoder();
    this.dsCurrVal = 0;
  }
  toUint8Array() {
    return toUint8Array(this.restEncoder);
  }
  resetDsCurVal() {
    this.dsCurrVal = 0;
  }
  /**
   * @param {number} clock
   */
  writeDsClock(clock) {
    const diff = clock - this.dsCurrVal;
    this.dsCurrVal = clock;
    writeVarUint(this.restEncoder, diff);
  }
  /**
   * @param {number} len
   */
  writeDsLen(len) {
    if (len === 0) {
      unexpectedCase();
    }
    writeVarUint(this.restEncoder, len - 1);
    this.dsCurrVal += len;
  }
};
var UpdateEncoderV2 = class extends DSEncoderV2 {
  constructor() {
    super();
    this.keyMap = /* @__PURE__ */ new Map();
    this.keyClock = 0;
    this.keyClockEncoder = new IntDiffOptRleEncoder();
    this.clientEncoder = new UintOptRleEncoder();
    this.leftClockEncoder = new IntDiffOptRleEncoder();
    this.rightClockEncoder = new IntDiffOptRleEncoder();
    this.infoEncoder = new RleEncoder(writeUint8);
    this.stringEncoder = new StringEncoder();
    this.parentInfoEncoder = new RleEncoder(writeUint8);
    this.typeRefEncoder = new UintOptRleEncoder();
    this.lenEncoder = new UintOptRleEncoder();
  }
  toUint8Array() {
    const encoder = createEncoder();
    writeVarUint(encoder, 0);
    writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
    writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
    writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
    writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
    writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
    writeUint8Array(encoder, toUint8Array(this.restEncoder));
    return toUint8Array(encoder);
  }
  /**
   * @param {ID} id
   */
  writeLeftID(id2) {
    this.clientEncoder.write(id2.client);
    this.leftClockEncoder.write(id2.clock);
  }
  /**
   * @param {ID} id
   */
  writeRightID(id2) {
    this.clientEncoder.write(id2.client);
    this.rightClockEncoder.write(id2.clock);
  }
  /**
   * @param {number} client
   */
  writeClient(client) {
    this.clientEncoder.write(client);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo(info) {
    this.infoEncoder.write(info);
  }
  /**
   * @param {string} s
   */
  writeString(s) {
    this.stringEncoder.write(s);
  }
  /**
   * @param {boolean} isYKey
   */
  writeParentInfo(isYKey) {
    this.parentInfoEncoder.write(isYKey ? 1 : 0);
  }
  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef(info) {
    this.typeRefEncoder.write(info);
  }
  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen(len) {
    this.lenEncoder.write(len);
  }
  /**
   * @param {any} any
   */
  writeAny(any2) {
    writeAny(this.restEncoder, any2);
  }
  /**
   * @param {Uint8Array} buf
   */
  writeBuf(buf) {
    writeVarUint8Array(this.restEncoder, buf);
  }
  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON(embed) {
    writeAny(this.restEncoder, embed);
  }
  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey(key) {
    const clock = this.keyMap.get(key);
    if (clock === void 0) {
      this.keyClockEncoder.write(this.keyClock++);
      this.stringEncoder.write(key);
    } else {
      this.keyClockEncoder.write(clock);
    }
  }
};
var writeStructs = (encoder, structs, client, clock) => {
  clock = max(clock, structs[0].id.clock);
  const startNewStructs = findIndexSS(structs, clock);
  writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
  encoder.writeClient(client);
  writeVarUint(encoder.restEncoder, clock);
  const firstStruct = structs[startNewStructs];
  firstStruct.write(encoder, clock - firstStruct.id.clock);
  for (let i = startNewStructs + 1; i < structs.length; i++) {
    structs[i].write(encoder, 0);
  }
};
var writeClientsStructs = (encoder, store, _sm) => {
  const sm = /* @__PURE__ */ new Map();
  _sm.forEach((clock, client) => {
    if (getState(store, client) > clock) {
      sm.set(client, clock);
    }
  });
  getStateVector(store).forEach((_clock, client) => {
    if (!_sm.has(client)) {
      sm.set(client, 0);
    }
  });
  writeVarUint(encoder.restEncoder, sm.size);
  from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeStructs(
      encoder,
      /** @type {Array<GC|Item>} */
      store.clients.get(client),
      client,
      clock
    );
  });
};
var readClientsStructRefs = (decoder, doc) => {
  const clientRefs = create();
  const numOfStateUpdates = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint(decoder.restDecoder);
    const refs = new Array(numberOfStructs);
    const client = decoder.readClient();
    let clock = readVarUint(decoder.restDecoder);
    clientRefs.set(client, { i: 0, refs });
    for (let i2 = 0; i2 < numberOfStructs; i2++) {
      const info = decoder.readInfo();
      switch (BITS5 & info) {
        case 0: {
          const len = decoder.readLen();
          refs[i2] = new GC(createID(client, clock), len);
          clock += len;
          break;
        }
        case 10: {
          const len = readVarUint(decoder.restDecoder);
          refs[i2] = new Skip(createID(client, clock), len);
          clock += len;
          break;
        }
        default: {
          const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
          const struct = new Item(
            createID(client, clock),
            null,
            // left
            (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
            // origin
            null,
            // right
            (info & BIT7) === BIT7 ? decoder.readRightID() : null,
            // right origin
            cantCopyParentInfo ? decoder.readParentInfo() ? doc.get(decoder.readString()) : decoder.readLeftID() : null,
            // parent
            cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
            // parentSub
            readItemContent(decoder, info)
            // item content
          );
          refs[i2] = struct;
          clock += struct.length;
        }
      }
    }
  }
  return clientRefs;
};
var integrateStructs = (transaction, store, clientsStructRefs) => {
  const stack = [];
  let clientsStructRefsIds = from(clientsStructRefs.keys()).sort((a, b) => a - b);
  if (clientsStructRefsIds.length === 0) {
    return null;
  }
  const getNextStructTarget = () => {
    if (clientsStructRefsIds.length === 0) {
      return null;
    }
    let nextStructsTarget = (
      /** @type {{i:number,refs:Array<GC|Item>}} */
      clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1])
    );
    while (nextStructsTarget.refs.length === nextStructsTarget.i) {
      clientsStructRefsIds.pop();
      if (clientsStructRefsIds.length > 0) {
        nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */
        clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]);
      } else {
        return null;
      }
    }
    return nextStructsTarget;
  };
  let curStructsTarget = getNextStructTarget();
  if (curStructsTarget === null) {
    return null;
  }
  const restStructs = new StructStore();
  const missingSV = /* @__PURE__ */ new Map();
  const updateMissingSv = (client, clock) => {
    const mclock = missingSV.get(client);
    if (mclock == null || mclock > clock) {
      missingSV.set(client, clock);
    }
  };
  let stackHead = (
    /** @type {any} */
    curStructsTarget.refs[
      /** @type {any} */
      curStructsTarget.i++
    ]
  );
  const state = /* @__PURE__ */ new Map();
  const addStackToRestSS = () => {
    for (const item of stack) {
      const client = item.id.client;
      const inapplicableItems = clientsStructRefs.get(client);
      if (inapplicableItems) {
        inapplicableItems.i--;
        restStructs.clients.set(client, inapplicableItems.refs.slice(inapplicableItems.i));
        clientsStructRefs.delete(client);
        inapplicableItems.i = 0;
        inapplicableItems.refs = [];
      } else {
        restStructs.clients.set(client, [item]);
      }
      clientsStructRefsIds = clientsStructRefsIds.filter((c) => c !== client);
    }
    stack.length = 0;
  };
  while (true) {
    if (stackHead.constructor !== Skip) {
      const localClock = setIfUndefined(state, stackHead.id.client, () => getState(store, stackHead.id.client));
      const offset = localClock - stackHead.id.clock;
      if (offset < 0) {
        stack.push(stackHead);
        updateMissingSv(stackHead.id.client, stackHead.id.clock - 1);
        addStackToRestSS();
      } else {
        const missing = stackHead.getMissing(transaction, store);
        if (missing !== null) {
          stack.push(stackHead);
          const structRefs = clientsStructRefs.get(
            /** @type {number} */
            missing
          ) || { refs: [], i: 0 };
          if (structRefs.refs.length === structRefs.i) {
            updateMissingSv(
              /** @type {number} */
              missing,
              getState(store, missing)
            );
            addStackToRestSS();
          } else {
            stackHead = structRefs.refs[structRefs.i++];
            continue;
          }
        } else if (offset === 0 || offset < stackHead.length) {
          stackHead.integrate(transaction, offset);
          state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
        }
      }
    }
    if (stack.length > 0) {
      stackHead = /** @type {GC|Item} */
      stack.pop();
    } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
      stackHead = /** @type {GC|Item} */
      curStructsTarget.refs[curStructsTarget.i++];
    } else {
      curStructsTarget = getNextStructTarget();
      if (curStructsTarget === null) {
        break;
      } else {
        stackHead = /** @type {GC|Item} */
        curStructsTarget.refs[curStructsTarget.i++];
      }
    }
  }
  if (restStructs.clients.size > 0) {
    const encoder = new UpdateEncoderV2();
    writeClientsStructs(encoder, restStructs, /* @__PURE__ */ new Map());
    writeVarUint(encoder.restEncoder, 0);
    return { missing: missingSV, update: encoder.toUint8Array() };
  }
  return null;
};
var writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
var readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) => transact(ydoc, (transaction) => {
  transaction.local = false;
  let retry = false;
  const doc = transaction.doc;
  const store = doc.store;
  const ss = readClientsStructRefs(structDecoder, doc);
  const restStructs = integrateStructs(transaction, store, ss);
  const pending = store.pendingStructs;
  if (pending) {
    for (const [client, clock] of pending.missing) {
      if (clock < getState(store, client)) {
        retry = true;
        break;
      }
    }
    if (restStructs) {
      for (const [client, clock] of restStructs.missing) {
        const mclock = pending.missing.get(client);
        if (mclock == null || mclock > clock) {
          pending.missing.set(client, clock);
        }
      }
      pending.update = mergeUpdatesV2([pending.update, restStructs.update]);
    }
  } else {
    store.pendingStructs = restStructs;
  }
  const dsRest = readAndApplyDeleteSet(structDecoder, transaction, store);
  if (store.pendingDs) {
    const pendingDSUpdate = new UpdateDecoderV2(createDecoder(store.pendingDs));
    readVarUint(pendingDSUpdate.restDecoder);
    const dsRest2 = readAndApplyDeleteSet(pendingDSUpdate, transaction, store);
    if (dsRest && dsRest2) {
      store.pendingDs = mergeUpdatesV2([dsRest, dsRest2]);
    } else {
      store.pendingDs = dsRest || dsRest2;
    }
  } else {
    store.pendingDs = dsRest;
  }
  if (retry) {
    const update = (
      /** @type {{update: Uint8Array}} */
      store.pendingStructs.update
    );
    store.pendingStructs = null;
    applyUpdateV2(transaction.doc, update);
  }
}, transactionOrigin, false);
var applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
  const decoder = createDecoder(update);
  readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
};
var applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, UpdateDecoderV1);
var writeStateAsUpdate = (encoder, doc, targetStateVector = /* @__PURE__ */ new Map()) => {
  writeClientsStructs(encoder, doc.store, targetStateVector);
  writeDeleteSet(encoder, createDeleteSetFromStructStore(doc.store));
};
var encodeStateAsUpdateV2 = (doc, encodedTargetStateVector = new Uint8Array([0]), encoder = new UpdateEncoderV2()) => {
  const targetStateVector = decodeStateVector(encodedTargetStateVector);
  writeStateAsUpdate(encoder, doc, targetStateVector);
  const updates = [encoder.toUint8Array()];
  if (doc.store.pendingDs) {
    updates.push(doc.store.pendingDs);
  }
  if (doc.store.pendingStructs) {
    updates.push(diffUpdateV2(doc.store.pendingStructs.update, encodedTargetStateVector));
  }
  if (updates.length > 1) {
    if (encoder.constructor === UpdateEncoderV1) {
      return mergeUpdates(updates.map((update, i) => i === 0 ? update : convertUpdateFormatV2ToV1(update)));
    } else if (encoder.constructor === UpdateEncoderV2) {
      return mergeUpdatesV2(updates);
    }
  }
  return updates[0];
};
var encodeStateAsUpdate = (doc, encodedTargetStateVector) => encodeStateAsUpdateV2(doc, encodedTargetStateVector, new UpdateEncoderV1());
var readStateVector = (decoder) => {
  const ss = /* @__PURE__ */ new Map();
  const ssLength = readVarUint(decoder.restDecoder);
  for (let i = 0; i < ssLength; i++) {
    const client = readVarUint(decoder.restDecoder);
    const clock = readVarUint(decoder.restDecoder);
    ss.set(client, clock);
  }
  return ss;
};
var decodeStateVector = (decodedState) => readStateVector(new DSDecoderV1(createDecoder(decodedState)));
var writeStateVector = (encoder, sv) => {
  writeVarUint(encoder.restEncoder, sv.size);
  from(sv.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    writeVarUint(encoder.restEncoder, client);
    writeVarUint(encoder.restEncoder, clock);
  });
  return encoder;
};
var writeDocumentStateVector = (encoder, doc) => writeStateVector(encoder, getStateVector(doc.store));
var encodeStateVectorV2 = (doc, encoder = new DSEncoderV2()) => {
  if (doc instanceof Map) {
    writeStateVector(encoder, doc);
  } else {
    writeDocumentStateVector(encoder, doc);
  }
  return encoder.toUint8Array();
};
var encodeStateVector = (doc) => encodeStateVectorV2(doc, new DSEncoderV1());
var EventHandler = class {
  constructor() {
    this.l = [];
  }
};
var createEventHandler = () => new EventHandler();
var addEventHandlerListener = (eventHandler, f) => eventHandler.l.push(f);
var removeEventHandlerListener = (eventHandler, f) => {
  const l = eventHandler.l;
  const len = l.length;
  eventHandler.l = l.filter((g) => f !== g);
  if (len === eventHandler.l.length) {
    console.error("[yjs] Tried to remove event handler that doesn't exist.");
  }
};
var callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
var ID = class {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor(client, clock) {
    this.client = client;
    this.clock = clock;
  }
};
var compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
var createID = (client, clock) => new ID(client, clock);
var findRootTypeKey = (type) => {
  for (const [key, value] of type.doc.share.entries()) {
    if (value === type) {
      return key;
    }
  }
  throw unexpectedCase();
};
var Snapshot = class {
  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} sv state map
   */
  constructor(ds, sv) {
    this.ds = ds;
    this.sv = sv;
  }
};
var createSnapshot = (ds, sm) => new Snapshot(ds, sm);
var emptySnapshot = createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
var isVisible = (item, snapshot) => snapshot === void 0 ? !item.deleted : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id);
var splitSnapshotAffectedStructs = (transaction, snapshot) => {
  const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create2);
  const store = transaction.doc.store;
  if (!meta.has(snapshot)) {
    snapshot.sv.forEach((clock, client) => {
      if (clock < getState(store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
    });
    iterateDeletedStructs(transaction, snapshot.ds, (_item) => {
    });
    meta.add(snapshot);
  }
};
var StructStore = class {
  constructor() {
    this.clients = /* @__PURE__ */ new Map();
    this.pendingStructs = null;
    this.pendingDs = null;
  }
};
var getStateVector = (store) => {
  const sm = /* @__PURE__ */ new Map();
  store.clients.forEach((structs, client) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm;
};
var getState = (store, client) => {
  const structs = store.clients.get(client);
  if (structs === void 0) {
    return 0;
  }
  const lastStruct = structs[structs.length - 1];
  return lastStruct.id.clock + lastStruct.length;
};
var addStruct = (store, struct) => {
  let structs = store.clients.get(struct.id.client);
  if (structs === void 0) {
    structs = [];
    store.clients.set(struct.id.client, structs);
  } else {
    const lastStruct = structs[structs.length - 1];
    if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
      throw unexpectedCase();
    }
  }
  structs.push(struct);
};
var findIndexSS = (structs, clock) => {
  let left = 0;
  let right = structs.length - 1;
  let mid = structs[right];
  let midclock = mid.id.clock;
  if (midclock === clock) {
    return right;
  }
  let midindex = floor(clock / (midclock + mid.length - 1) * right);
  while (left <= right) {
    mid = structs[midindex];
    midclock = mid.id.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.length) {
        return midindex;
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
    midindex = floor((left + right) / 2);
  }
  throw unexpectedCase();
};
var find = (store, id2) => {
  const structs = store.clients.get(id2.client);
  return structs[findIndexSS(structs, id2.clock)];
};
var getItem = (
  /** @type {function(StructStore,ID):Item} */
  find
);
var findIndexCleanStart = (transaction, structs, clock) => {
  const index = findIndexSS(structs, clock);
  const struct = structs[index];
  if (struct.id.clock < clock && struct instanceof Item) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
    return index + 1;
  }
  return index;
};
var getItemCleanStart = (transaction, id2) => {
  const structs = (
    /** @type {Array<Item>} */
    transaction.doc.store.clients.get(id2.client)
  );
  return structs[findIndexCleanStart(transaction, structs, id2.clock)];
};
var getItemCleanEnd = (transaction, store, id2) => {
  const structs = store.clients.get(id2.client);
  const index = findIndexSS(structs, id2.clock);
  const struct = structs[index];
  if (id2.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, id2.clock - struct.id.clock + 1));
  }
  return struct;
};
var replaceStruct = (store, struct, newStruct) => {
  const structs = (
    /** @type {Array<GC|Item>} */
    store.clients.get(struct.id.client)
  );
  structs[findIndexSS(structs, struct.id.clock)] = newStruct;
};
var iterateStructs = (transaction, structs, clockStart, len, f) => {
  if (len === 0) {
    return;
  }
  const clockEnd = clockStart + len;
  let index = findIndexCleanStart(transaction, structs, clockStart);
  let struct;
  do {
    struct = structs[index++];
    if (clockEnd < struct.id.clock + struct.length) {
      findIndexCleanStart(transaction, structs, clockEnd);
    }
    f(struct);
  } while (index < structs.length && structs[index].id.clock < clockEnd);
};
var Transaction = class {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor(doc, origin, local) {
    this.doc = doc;
    this.deleteSet = new DeleteSet();
    this.beforeState = getStateVector(doc.store);
    this.afterState = /* @__PURE__ */ new Map();
    this.changed = /* @__PURE__ */ new Map();
    this.changedParentTypes = /* @__PURE__ */ new Map();
    this._mergeStructs = [];
    this.origin = origin;
    this.meta = /* @__PURE__ */ new Map();
    this.local = local;
    this.subdocsAdded = /* @__PURE__ */ new Set();
    this.subdocsRemoved = /* @__PURE__ */ new Set();
    this.subdocsLoaded = /* @__PURE__ */ new Set();
    this._needFormattingCleanup = false;
  }
};
var writeUpdateMessageFromTransaction = (encoder, transaction) => {
  if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
    return false;
  }
  sortAndMergeDeleteSet(transaction.deleteSet);
  writeStructsFromTransaction(encoder, transaction);
  writeDeleteSet(encoder, transaction.deleteSet);
  return true;
};
var addChangedTypeToTransaction = (transaction, type, parentSub) => {
  const item = type._item;
  if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
    setIfUndefined(transaction.changed, type, create2).add(parentSub);
  }
};
var tryToMergeWithLefts = (structs, pos) => {
  let right = structs[pos];
  let left = structs[pos - 1];
  let i = pos;
  for (; i > 0; right = left, left = structs[--i - 1]) {
    if (left.deleted === right.deleted && left.constructor === right.constructor) {
      if (left.mergeWith(right)) {
        if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */
        right.parent._map.get(right.parentSub) === right) {
          right.parent._map.set(
            right.parentSub,
            /** @type {Item} */
            left
          );
        }
        continue;
      }
    }
    break;
  }
  const merged = pos - i;
  if (merged) {
    structs.splice(pos + 1 - merged, merged);
  }
  return merged;
};
var tryGcDeleteSet = (ds, store, gcFilter) => {
  for (const [client, deleteItems] of ds.clients.entries()) {
    const structs = (
      /** @type {Array<GC|Item>} */
      store.clients.get(client)
    );
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const endDeleteItemClock = deleteItem.clock + deleteItem.len;
      for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
        const struct2 = structs[si];
        if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
          break;
        }
        if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
          struct2.gc(store, false);
        }
      }
    }
  }
};
var tryMergeDeleteSet = (ds, store) => {
  ds.clients.forEach((deleteItems, client) => {
    const structs = (
      /** @type {Array<GC|Item>} */
      store.clients.get(client)
    );
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
      for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[si]) {
        si -= 1 + tryToMergeWithLefts(structs, si);
      }
    }
  });
};
var cleanupTransactions = (transactionCleanups, i) => {
  if (i < transactionCleanups.length) {
    const transaction = transactionCleanups[i];
    const doc = transaction.doc;
    const store = doc.store;
    const ds = transaction.deleteSet;
    const mergeStructs = transaction._mergeStructs;
    try {
      sortAndMergeDeleteSet(ds);
      transaction.afterState = getStateVector(transaction.doc.store);
      doc.emit("beforeObserverCalls", [transaction, doc]);
      const fs = [];
      transaction.changed.forEach(
        (subs, itemtype) => fs.push(() => {
          if (itemtype._item === null || !itemtype._item.deleted) {
            itemtype._callObserver(transaction, subs);
          }
        })
      );
      fs.push(() => {
        transaction.changedParentTypes.forEach((events, type) => {
          if (type._dEH.l.length > 0 && (type._item === null || !type._item.deleted)) {
            events = events.filter(
              (event) => event.target._item === null || !event.target._item.deleted
            );
            events.forEach((event) => {
              event.currentTarget = type;
              event._path = null;
            });
            events.sort((event1, event2) => event1.path.length - event2.path.length);
            fs.push(() => {
              callEventHandlerListeners(type._dEH, events, transaction);
            });
          }
        });
        fs.push(() => doc.emit("afterTransaction", [transaction, doc]));
        fs.push(() => {
          if (transaction._needFormattingCleanup) {
            cleanupYTextAfterTransaction(transaction);
          }
        });
      });
      callAll(fs, []);
    } finally {
      if (doc.gc) {
        tryGcDeleteSet(ds, store, doc.gcFilter);
      }
      tryMergeDeleteSet(ds, store);
      transaction.afterState.forEach((clock, client) => {
        const beforeClock = transaction.beforeState.get(client) || 0;
        if (beforeClock !== clock) {
          const structs = (
            /** @type {Array<GC|Item>} */
            store.clients.get(client)
          );
          const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
          for (let i2 = structs.length - 1; i2 >= firstChangePos; ) {
            i2 -= 1 + tryToMergeWithLefts(structs, i2);
          }
        }
      });
      for (let i2 = mergeStructs.length - 1; i2 >= 0; i2--) {
        const { client, clock } = mergeStructs[i2].id;
        const structs = (
          /** @type {Array<GC|Item>} */
          store.clients.get(client)
        );
        const replacedStructPos = findIndexSS(structs, clock);
        if (replacedStructPos + 1 < structs.length) {
          if (tryToMergeWithLefts(structs, replacedStructPos + 1) > 1) {
            continue;
          }
        }
        if (replacedStructPos > 0) {
          tryToMergeWithLefts(structs, replacedStructPos);
        }
      }
      if (!transaction.local && transaction.afterState.get(doc.clientID) !== transaction.beforeState.get(doc.clientID)) {
        print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
        doc.clientID = generateNewClientId();
      }
      doc.emit("afterTransactionCleanup", [transaction, doc]);
      if (doc._observers.has("update")) {
        const encoder = new UpdateEncoderV1();
        const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent2) {
          doc.emit("update", [encoder.toUint8Array(), transaction.origin, doc, transaction]);
        }
      }
      if (doc._observers.has("updateV2")) {
        const encoder = new UpdateEncoderV2();
        const hasContent2 = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent2) {
          doc.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc, transaction]);
        }
      }
      const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
      if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
        subdocsAdded.forEach((subdoc) => {
          subdoc.clientID = doc.clientID;
          if (subdoc.collectionid == null) {
            subdoc.collectionid = doc.collectionid;
          }
          doc.subdocs.add(subdoc);
        });
        subdocsRemoved.forEach((subdoc) => doc.subdocs.delete(subdoc));
        doc.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc, transaction]);
        subdocsRemoved.forEach((subdoc) => subdoc.destroy());
      }
      if (transactionCleanups.length <= i + 1) {
        doc._transactionCleanups = [];
        doc.emit("afterAllTransactions", [doc, transactionCleanups]);
      } else {
        cleanupTransactions(transactionCleanups, i + 1);
      }
    }
  }
};
var transact = (doc, f, origin = null, local = true) => {
  const transactionCleanups = doc._transactionCleanups;
  let initialCall = false;
  let result = null;
  if (doc._transaction === null) {
    initialCall = true;
    doc._transaction = new Transaction(doc, origin, local);
    transactionCleanups.push(doc._transaction);
    if (transactionCleanups.length === 1) {
      doc.emit("beforeAllTransactions", [doc]);
    }
    doc.emit("beforeTransaction", [doc._transaction, doc]);
  }
  try {
    result = f(doc._transaction);
  } finally {
    if (initialCall) {
      const finishCleanup = doc._transaction === transactionCleanups[0];
      doc._transaction = null;
      if (finishCleanup) {
        cleanupTransactions(transactionCleanups, 0);
      }
    }
  }
  return result;
};
function* lazyStructReaderGenerator(decoder) {
  const numOfStateUpdates = readVarUint(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = readVarUint(decoder.restDecoder);
    const client = decoder.readClient();
    let clock = readVarUint(decoder.restDecoder);
    for (let i2 = 0; i2 < numberOfStructs; i2++) {
      const info = decoder.readInfo();
      if (info === 10) {
        const len = readVarUint(decoder.restDecoder);
        yield new Skip(createID(client, clock), len);
        clock += len;
      } else if ((BITS5 & info) !== 0) {
        const cantCopyParentInfo = (info & (BIT7 | BIT8)) === 0;
        const struct = new Item(
          createID(client, clock),
          null,
          // left
          (info & BIT8) === BIT8 ? decoder.readLeftID() : null,
          // origin
          null,
          // right
          (info & BIT7) === BIT7 ? decoder.readRightID() : null,
          // right origin
          // @ts-ignore Force writing a string here.
          cantCopyParentInfo ? decoder.readParentInfo() ? decoder.readString() : decoder.readLeftID() : null,
          // parent
          cantCopyParentInfo && (info & BIT6) === BIT6 ? decoder.readString() : null,
          // parentSub
          readItemContent(decoder, info)
          // item content
        );
        yield struct;
        clock += struct.length;
      } else {
        const len = decoder.readLen();
        yield new GC(createID(client, clock), len);
        clock += len;
      }
    }
  }
}
var LazyStructReader = class {
  /**
   * @param {UpdateDecoderV1 | UpdateDecoderV2} decoder
   * @param {boolean} filterSkips
   */
  constructor(decoder, filterSkips) {
    this.gen = lazyStructReaderGenerator(decoder);
    this.curr = null;
    this.done = false;
    this.filterSkips = filterSkips;
    this.next();
  }
  /**
   * @return {Item | GC | Skip |null}
   */
  next() {
    do {
      this.curr = this.gen.next().value || null;
    } while (this.filterSkips && this.curr !== null && this.curr.constructor === Skip);
    return this.curr;
  }
};
var LazyStructWriter = class {
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  constructor(encoder) {
    this.currClient = 0;
    this.startClock = 0;
    this.written = 0;
    this.encoder = encoder;
    this.clientStructs = [];
  }
};
var mergeUpdates = (updates) => mergeUpdatesV2(updates, UpdateDecoderV1, UpdateEncoderV1);
var sliceStruct = (left, diff) => {
  if (left.constructor === GC) {
    const { client, clock } = left.id;
    return new GC(createID(client, clock + diff), left.length - diff);
  } else if (left.constructor === Skip) {
    const { client, clock } = left.id;
    return new Skip(createID(client, clock + diff), left.length - diff);
  } else {
    const leftItem = (
      /** @type {Item} */
      left
    );
    const { client, clock } = leftItem.id;
    return new Item(
      createID(client, clock + diff),
      null,
      createID(client, clock + diff - 1),
      null,
      leftItem.rightOrigin,
      leftItem.parent,
      leftItem.parentSub,
      leftItem.content.splice(diff)
    );
  }
};
var mergeUpdatesV2 = (updates, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  if (updates.length === 1) {
    return updates[0];
  }
  const updateDecoders = updates.map((update) => new YDecoder(createDecoder(update)));
  let lazyStructDecoders = updateDecoders.map((decoder) => new LazyStructReader(decoder, true));
  let currWrite = null;
  const updateEncoder = new YEncoder();
  const lazyStructEncoder = new LazyStructWriter(updateEncoder);
  while (true) {
    lazyStructDecoders = lazyStructDecoders.filter((dec) => dec.curr !== null);
    lazyStructDecoders.sort(
      /** @type {function(any,any):number} */
      (dec1, dec2) => {
        if (dec1.curr.id.client === dec2.curr.id.client) {
          const clockDiff = dec1.curr.id.clock - dec2.curr.id.clock;
          if (clockDiff === 0) {
            return dec1.curr.constructor === dec2.curr.constructor ? 0 : dec1.curr.constructor === Skip ? 1 : -1;
          } else {
            return clockDiff;
          }
        } else {
          return dec2.curr.id.client - dec1.curr.id.client;
        }
      }
    );
    if (lazyStructDecoders.length === 0) {
      break;
    }
    const currDecoder = lazyStructDecoders[0];
    const firstClient = (
      /** @type {Item | GC} */
      currDecoder.curr.id.client
    );
    if (currWrite !== null) {
      let curr = (
        /** @type {Item | GC | null} */
        currDecoder.curr
      );
      let iterated = false;
      while (curr !== null && curr.id.clock + curr.length <= currWrite.struct.id.clock + currWrite.struct.length && curr.id.client >= currWrite.struct.id.client) {
        curr = currDecoder.next();
        iterated = true;
      }
      if (curr === null || // current decoder is empty
      curr.id.client !== firstClient || // check whether there is another decoder that has has updates from `firstClient`
      iterated && curr.id.clock > currWrite.struct.id.clock + currWrite.struct.length) {
        continue;
      }
      if (firstClient !== currWrite.struct.id.client) {
        writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
        currWrite = { struct: curr, offset: 0 };
        currDecoder.next();
      } else {
        if (currWrite.struct.id.clock + currWrite.struct.length < curr.id.clock) {
          if (currWrite.struct.constructor === Skip) {
            currWrite.struct.length = curr.id.clock + curr.length - currWrite.struct.id.clock;
          } else {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            const diff = curr.id.clock - currWrite.struct.id.clock - currWrite.struct.length;
            const struct = new Skip(createID(firstClient, currWrite.struct.id.clock + currWrite.struct.length), diff);
            currWrite = { struct, offset: 0 };
          }
        } else {
          const diff = currWrite.struct.id.clock + currWrite.struct.length - curr.id.clock;
          if (diff > 0) {
            if (currWrite.struct.constructor === Skip) {
              currWrite.struct.length -= diff;
            } else {
              curr = sliceStruct(curr, diff);
            }
          }
          if (!currWrite.struct.mergeWith(
            /** @type {any} */
            curr
          )) {
            writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
            currWrite = { struct: curr, offset: 0 };
            currDecoder.next();
          }
        }
      }
    } else {
      currWrite = { struct: (
        /** @type {Item | GC} */
        currDecoder.curr
      ), offset: 0 };
      currDecoder.next();
    }
    for (let next = currDecoder.curr; next !== null && next.id.client === firstClient && next.id.clock === currWrite.struct.id.clock + currWrite.struct.length && next.constructor !== Skip; next = currDecoder.next()) {
      writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
      currWrite = { struct: next, offset: 0 };
    }
  }
  if (currWrite !== null) {
    writeStructToLazyStructWriter(lazyStructEncoder, currWrite.struct, currWrite.offset);
    currWrite = null;
  }
  finishLazyStructWriting(lazyStructEncoder);
  const dss = updateDecoders.map((decoder) => readDeleteSet(decoder));
  const ds = mergeDeleteSets(dss);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array();
};
var diffUpdateV2 = (update, sv, YDecoder = UpdateDecoderV2, YEncoder = UpdateEncoderV2) => {
  const state = decodeStateVector(sv);
  const encoder = new YEncoder();
  const lazyStructWriter = new LazyStructWriter(encoder);
  const decoder = new YDecoder(createDecoder(update));
  const reader = new LazyStructReader(decoder, false);
  while (reader.curr) {
    const curr = reader.curr;
    const currClient = curr.id.client;
    const svClock = state.get(currClient) || 0;
    if (reader.curr.constructor === Skip) {
      reader.next();
      continue;
    }
    if (curr.id.clock + curr.length > svClock) {
      writeStructToLazyStructWriter(lazyStructWriter, curr, max(svClock - curr.id.clock, 0));
      reader.next();
      while (reader.curr && reader.curr.id.client === currClient) {
        writeStructToLazyStructWriter(lazyStructWriter, reader.curr, 0);
        reader.next();
      }
    } else {
      while (reader.curr && reader.curr.id.client === currClient && reader.curr.id.clock + reader.curr.length <= svClock) {
        reader.next();
      }
    }
  }
  finishLazyStructWriting(lazyStructWriter);
  const ds = readDeleteSet(decoder);
  writeDeleteSet(encoder, ds);
  return encoder.toUint8Array();
};
var flushLazyStructWriter = (lazyWriter) => {
  if (lazyWriter.written > 0) {
    lazyWriter.clientStructs.push({ written: lazyWriter.written, restEncoder: toUint8Array(lazyWriter.encoder.restEncoder) });
    lazyWriter.encoder.restEncoder = createEncoder();
    lazyWriter.written = 0;
  }
};
var writeStructToLazyStructWriter = (lazyWriter, struct, offset) => {
  if (lazyWriter.written > 0 && lazyWriter.currClient !== struct.id.client) {
    flushLazyStructWriter(lazyWriter);
  }
  if (lazyWriter.written === 0) {
    lazyWriter.currClient = struct.id.client;
    lazyWriter.encoder.writeClient(struct.id.client);
    writeVarUint(lazyWriter.encoder.restEncoder, struct.id.clock + offset);
  }
  struct.write(lazyWriter.encoder, offset);
  lazyWriter.written++;
};
var finishLazyStructWriting = (lazyWriter) => {
  flushLazyStructWriter(lazyWriter);
  const restEncoder = lazyWriter.encoder.restEncoder;
  writeVarUint(restEncoder, lazyWriter.clientStructs.length);
  for (let i = 0; i < lazyWriter.clientStructs.length; i++) {
    const partStructs = lazyWriter.clientStructs[i];
    writeVarUint(restEncoder, partStructs.written);
    writeUint8Array(restEncoder, partStructs.restEncoder);
  }
};
var convertUpdateFormat = (update, blockTransformer, YDecoder, YEncoder) => {
  const updateDecoder = new YDecoder(createDecoder(update));
  const lazyDecoder = new LazyStructReader(updateDecoder, false);
  const updateEncoder = new YEncoder();
  const lazyWriter = new LazyStructWriter(updateEncoder);
  for (let curr = lazyDecoder.curr; curr !== null; curr = lazyDecoder.next()) {
    writeStructToLazyStructWriter(lazyWriter, blockTransformer(curr), 0);
  }
  finishLazyStructWriting(lazyWriter);
  const ds = readDeleteSet(updateDecoder);
  writeDeleteSet(updateEncoder, ds);
  return updateEncoder.toUint8Array();
};
var convertUpdateFormatV2ToV1 = (update) => convertUpdateFormat(update, id, UpdateDecoderV2, UpdateEncoderV1);
var errorComputeChanges = "You must not compute changes after the event-handler fired.";
var YEvent = class {
  /**
   * @param {T} target The changed type.
   * @param {Transaction} transaction
   */
  constructor(target, transaction) {
    this.target = target;
    this.currentTarget = target;
    this.transaction = transaction;
    this._changes = null;
    this._keys = null;
    this._delta = null;
    this._path = null;
  }
  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path() {
    return this._path || (this._path = getPathTo(this.currentTarget, this.target));
  }
  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes(struct) {
    return isDeleted(this.transaction.deleteSet, struct.id);
  }
  /**
   * @type {Map<string, { action: 'add' | 'update' | 'delete', oldValue: any }>}
   */
  get keys() {
    if (this._keys === null) {
      if (this.transaction.doc._transactionCleanups.length === 0) {
        throw create3(errorComputeChanges);
      }
      const keys2 = /* @__PURE__ */ new Map();
      const target = this.target;
      const changed = (
        /** @type Set<string|null> */
        this.transaction.changed.get(target)
      );
      changed.forEach((key) => {
        if (key !== null) {
          const item = (
            /** @type {Item} */
            target._map.get(key)
          );
          let action;
          let oldValue;
          if (this.adds(item)) {
            let prev = item.left;
            while (prev !== null && this.adds(prev)) {
              prev = prev.left;
            }
            if (this.deletes(item)) {
              if (prev !== null && this.deletes(prev)) {
                action = "delete";
                oldValue = last(prev.content.getContent());
              } else {
                return;
              }
            } else {
              if (prev !== null && this.deletes(prev)) {
                action = "update";
                oldValue = last(prev.content.getContent());
              } else {
                action = "add";
                oldValue = void 0;
              }
            }
          } else {
            if (this.deletes(item)) {
              action = "delete";
              oldValue = last(
                /** @type {Item} */
                item.content.getContent()
              );
            } else {
              return;
            }
          }
          keys2.set(key, { action, oldValue });
        }
      });
      this._keys = keys2;
    }
    return this._keys;
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {Array<{insert?: string | Array<any> | object | AbstractType<any>, retain?: number, delete?: number, attributes?: Object<string, any>}>}
   */
  get delta() {
    return this.changes.delta;
  }
  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds(struct) {
    return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
  }
  /**
   * This is a computed property. Note that this can only be safely computed during the
   * event call. Computing this property after other changes happened might result in
   * unexpected behavior (incorrect computation of deltas). A safe way to collect changes
   * is to store the `changes` or the `delta` object. Avoid storing the `transaction` object.
   *
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    let changes = this._changes;
    if (changes === null) {
      if (this.transaction.doc._transactionCleanups.length === 0) {
        throw create3(errorComputeChanges);
      }
      const target = this.target;
      const added = create2();
      const deleted = create2();
      const delta = [];
      changes = {
        added,
        deleted,
        delta,
        keys: this.keys
      };
      const changed = (
        /** @type Set<string|null> */
        this.transaction.changed.get(target)
      );
      if (changed.has(null)) {
        let lastOp = null;
        const packOp = () => {
          if (lastOp) {
            delta.push(lastOp);
          }
        };
        for (let item = target._start; item !== null; item = item.right) {
          if (item.deleted) {
            if (this.deletes(item) && !this.adds(item)) {
              if (lastOp === null || lastOp.delete === void 0) {
                packOp();
                lastOp = { delete: 0 };
              }
              lastOp.delete += item.length;
              deleted.add(item);
            }
          } else {
            if (this.adds(item)) {
              if (lastOp === null || lastOp.insert === void 0) {
                packOp();
                lastOp = { insert: [] };
              }
              lastOp.insert = lastOp.insert.concat(item.content.getContent());
              added.add(item);
            } else {
              if (lastOp === null || lastOp.retain === void 0) {
                packOp();
                lastOp = { retain: 0 };
              }
              lastOp.retain += item.length;
            }
          }
        }
        if (lastOp !== null && lastOp.retain === void 0) {
          packOp();
        }
      }
      this._changes = changes;
    }
    return (
      /** @type {any} */
      changes
    );
  }
};
var getPathTo = (parent, child) => {
  const path = [];
  while (child._item !== null && child !== parent) {
    if (child._item.parentSub !== null) {
      path.unshift(child._item.parentSub);
    } else {
      let i = 0;
      let c = (
        /** @type {AbstractType<any>} */
        child._item.parent._start
      );
      while (c !== child._item && c !== null) {
        if (!c.deleted && c.countable) {
          i += c.length;
        }
        c = c.right;
      }
      path.unshift(i);
    }
    child = /** @type {AbstractType<any>} */
    child._item.parent;
  }
  return path;
};
var warnPrematureAccess = () => {
  warn("Invalid access: Add Yjs type to a document before reading data.");
};
var maxSearchMarker = 80;
var globalSearchMarkerTimestamp = 0;
var ArraySearchMarker = class {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor(p, index) {
    p.marker = true;
    this.p = p;
    this.index = index;
    this.timestamp = globalSearchMarkerTimestamp++;
  }
};
var refreshMarkerTimestamp = (marker) => {
  marker.timestamp = globalSearchMarkerTimestamp++;
};
var overwriteMarker = (marker, p, index) => {
  marker.p.marker = false;
  marker.p = p;
  p.marker = true;
  marker.index = index;
  marker.timestamp = globalSearchMarkerTimestamp++;
};
var markPosition = (searchMarker, p, index) => {
  if (searchMarker.length >= maxSearchMarker) {
    const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    overwriteMarker(marker, p, index);
    return marker;
  } else {
    const pm = new ArraySearchMarker(p, index);
    searchMarker.push(pm);
    return pm;
  }
};
var findMarker = (yarray, index) => {
  if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
    return null;
  }
  const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
  let p = yarray._start;
  let pindex = 0;
  if (marker !== null) {
    p = marker.p;
    pindex = marker.index;
    refreshMarkerTimestamp(marker);
  }
  while (p.right !== null && pindex < index) {
    if (!p.deleted && p.countable) {
      if (index < pindex + p.length) {
        break;
      }
      pindex += p.length;
    }
    p = p.right;
  }
  while (p.left !== null && pindex > index) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  if (marker !== null && abs(marker.index - pindex) < /** @type {YText|YArray<any>} */
  p.parent.length / maxSearchMarker) {
    overwriteMarker(marker, p, pindex);
    return marker;
  } else {
    return markPosition(yarray._searchMarker, p, pindex);
  }
};
var updateMarkerChanges = (searchMarker, index, len) => {
  for (let i = searchMarker.length - 1; i >= 0; i--) {
    const m = searchMarker[i];
    if (len > 0) {
      let p = m.p;
      p.marker = false;
      while (p && (p.deleted || !p.countable)) {
        p = p.left;
        if (p && !p.deleted && p.countable) {
          m.index -= p.length;
        }
      }
      if (p === null || p.marker === true) {
        searchMarker.splice(i, 1);
        continue;
      }
      m.p = p;
      p.marker = true;
    }
    if (index < m.index || len > 0 && index === m.index) {
      m.index = max(index, m.index + len);
    }
  }
};
var callTypeObservers = (type, transaction, event) => {
  const changedType = type;
  const changedParentTypes = transaction.changedParentTypes;
  while (true) {
    setIfUndefined(changedParentTypes, type, () => []).push(event);
    if (type._item === null) {
      break;
    }
    type = /** @type {AbstractType<any>} */
    type._item.parent;
  }
  callEventHandlerListeners(changedType._eH, event, transaction);
};
var AbstractType = class {
  constructor() {
    this._item = null;
    this._map = /* @__PURE__ */ new Map();
    this._start = null;
    this.doc = null;
    this._length = 0;
    this._eH = createEventHandler();
    this._dEH = createEventHandler();
    this._searchMarker = null;
  }
  /**
   * @return {AbstractType<any>|null}
   */
  get parent() {
    return this._item ? (
      /** @type {AbstractType<any>} */
      this._item.parent
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate(y, item) {
    this.doc = y;
    this._item = item;
  }
  /**
   * @return {AbstractType<EventType>}
   */
  _copy() {
    throw methodUnimplemented();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {AbstractType<EventType>}
   */
  clone() {
    throw methodUnimplemented();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} _encoder
   */
  _write(_encoder) {
  }
  /**
   * The first non-deleted item
   */
  get _first() {
    let n = this._start;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} _parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(transaction, _parentSubs) {
    if (!transaction.local && this._searchMarker) {
      this._searchMarker.length = 0;
    }
  }
  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe(f) {
    addEventHandlerListener(this._eH, f);
  }
  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  observeDeep(f) {
    addEventHandlerListener(this._dEH, f);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve(f) {
    removeEventHandlerListener(this._eH, f);
  }
  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent<any>>,Transaction):void} f Observer function
   */
  unobserveDeep(f) {
    removeEventHandlerListener(this._dEH, f);
  }
  /**
   * @abstract
   * @return {any}
   */
  toJSON() {
  }
};
var typeListSlice = (type, start, end) => {
  type.doc ?? warnPrematureAccess();
  if (start < 0) {
    start = type._length + start;
  }
  if (end < 0) {
    end = type._length + end;
  }
  let len = end - start;
  const cs = [];
  let n = type._start;
  while (n !== null && len > 0) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      if (c.length <= start) {
        start -= c.length;
      } else {
        for (let i = start; i < c.length && len > 0; i++) {
          cs.push(c[i]);
          len--;
        }
        start = 0;
      }
    }
    n = n.right;
  }
  return cs;
};
var typeListToArray = (type) => {
  type.doc ?? warnPrematureAccess();
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs;
};
var typeListForEach = (type, f) => {
  let index = 0;
  let n = type._start;
  type.doc ?? warnPrematureAccess();
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        f(c[i], index++, type);
      }
    }
    n = n.right;
  }
};
var typeListMap = (type, f) => {
  const result = [];
  typeListForEach(type, (c, i) => {
    result.push(f(c, i, type));
  });
  return result;
};
var typeListCreateIterator = (type) => {
  let n = type._start;
  let currentContent = null;
  let currentContentIndex = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      if (currentContent === null) {
        while (n !== null && n.deleted) {
          n = n.right;
        }
        if (n === null) {
          return {
            done: true,
            value: void 0
          };
        }
        currentContent = n.content.getContent();
        currentContentIndex = 0;
        n = n.right;
      }
      const value = currentContent[currentContentIndex++];
      if (currentContent.length <= currentContentIndex) {
        currentContent = null;
      }
      return {
        done: false,
        value
      };
    }
  };
};
var typeListGet = (type, index) => {
  type.doc ?? warnPrematureAccess();
  const marker = findMarker(type, index);
  let n = type._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        return n.content.getContent()[index];
      }
      index -= n.length;
    }
  }
};
var typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
  let left = referenceItem;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const store = doc.store;
  const right = referenceItem === null ? parent._start : referenceItem.right;
  let jsonContent = [];
  const packJsonContent = () => {
    if (jsonContent.length > 0) {
      left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
      left.integrate(transaction, 0);
      jsonContent = [];
    }
  };
  content.forEach((c) => {
    if (c === null) {
      jsonContent.push(c);
    } else {
      switch (c.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          jsonContent.push(c);
          break;
        default:
          packJsonContent();
          switch (c.constructor) {
            case Uint8Array:
            case ArrayBuffer:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(
                /** @type {Uint8Array} */
                c
              )));
              left.integrate(transaction, 0);
              break;
            case Doc:
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(
                /** @type {Doc} */
                c
              ));
              left.integrate(transaction, 0);
              break;
            default:
              if (c instanceof AbstractType) {
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                left.integrate(transaction, 0);
              } else {
                throw new Error("Unexpected content type in insert operation");
              }
          }
      }
    }
  });
  packJsonContent();
};
var lengthExceeded = () => create3("Length exceeded!");
var typeListInsertGenerics = (transaction, parent, index, content) => {
  if (index > parent._length) {
    throw lengthExceeded();
  }
  if (index === 0) {
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, index, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, null, content);
  }
  const startIndex = index;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
    if (index === 0) {
      n = n.prev;
      index += n && n.countable && !n.deleted ? n.length : 0;
    }
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index <= n.length) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        break;
      }
      index -= n.length;
    }
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, content.length);
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
var typeListPushGenerics = (transaction, parent, content) => {
  const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
  let n = marker.p;
  if (n) {
    while (n.right) {
      n = n.right;
    }
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content);
};
var typeListDelete = (transaction, parent, index, length2) => {
  if (length2 === 0) {
    return;
  }
  const startIndex = index;
  const startLength = length2;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null && index > 0; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
      }
      index -= n.length;
    }
  }
  while (length2 > 0 && n !== null) {
    if (!n.deleted) {
      if (length2 < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length2));
      }
      n.delete(transaction);
      length2 -= n.length;
    }
    n = n.right;
  }
  if (length2 > 0) {
    throw lengthExceeded();
  }
  if (parent._searchMarker) {
    updateMarkerChanges(
      parent._searchMarker,
      startIndex,
      -startLength + length2
      /* in case we remove the above exception */
    );
  }
};
var typeMapDelete = (transaction, parent, key) => {
  const c = parent._map.get(key);
  if (c !== void 0) {
    c.delete(transaction);
  }
};
var typeMapSet = (transaction, parent, key, value) => {
  const left = parent._map.get(key) || null;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  let content;
  if (value == null) {
    content = new ContentAny([value]);
  } else {
    switch (value.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
      case Date:
      case BigInt:
        content = new ContentAny([value]);
        break;
      case Uint8Array:
        content = new ContentBinary(
          /** @type {Uint8Array} */
          value
        );
        break;
      case Doc:
        content = new ContentDoc(
          /** @type {Doc} */
          value
        );
        break;
      default:
        if (value instanceof AbstractType) {
          content = new ContentType(value);
        } else {
          throw new Error("Unexpected content type");
        }
    }
  }
  new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
};
var typeMapGet = (parent, key) => {
  parent.doc ?? warnPrematureAccess();
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
};
var typeMapGetAll = (parent) => {
  const res = {};
  parent.doc ?? warnPrematureAccess();
  parent._map.forEach((value, key) => {
    if (!value.deleted) {
      res[key] = value.content.getContent()[value.length - 1];
    }
  });
  return res;
};
var typeMapHas = (parent, key) => {
  parent.doc ?? warnPrematureAccess();
  const val = parent._map.get(key);
  return val !== void 0 && !val.deleted;
};
var typeMapGetAllSnapshot = (parent, snapshot) => {
  const res = {};
  parent._map.forEach((value, key) => {
    let v = value;
    while (v !== null && (!snapshot.sv.has(v.id.client) || v.id.clock >= (snapshot.sv.get(v.id.client) || 0))) {
      v = v.left;
    }
    if (v !== null && isVisible(v, snapshot)) {
      res[key] = v.content.getContent()[v.length - 1];
    }
  });
  return res;
};
var createMapIterator = (type) => {
  type.doc ?? warnPrematureAccess();
  return iteratorFilter(
    type._map.entries(),
    /** @param {any} entry */
    (entry) => !entry[1].deleted
  );
};
var YArrayEvent = class extends YEvent {
};
var YArray = class _YArray extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
    this._searchMarker = [];
  }
  /**
   * Construct a new YArray containing the specified items.
   * @template {Object<string,any>|Array<any>|number|null|string|Uint8Array} T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from(items) {
    const a = new _YArray();
    a.push(items);
    return a;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    );
    this._prelimContent = null;
  }
  /**
   * @return {YArray<T>}
   */
  _copy() {
    return new _YArray();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YArray<T>}
   */
  clone() {
    const arr = new _YArray();
    arr.insert(0, this.toArray().map(
      (el) => el instanceof AbstractType ? (
        /** @type {typeof el} */
        el.clone()
      ) : el
    ));
    return arr;
  }
  get length() {
    this.doc ?? warnPrematureAccess();
    return this._length;
  }
  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
  }
  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(
          transaction,
          this,
          index,
          /** @type {any} */
          content
        );
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   *
   * @todo Use the following implementation in all types.
   */
  push(content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListPushGenerics(
          transaction,
          this,
          /** @type {any} */
          content
        );
      });
    } else {
      this._prelimContent.push(...content);
    }
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<T>} content Array of content to prepend.
   */
  unshift(content) {
    this.insert(0, content);
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete(index, length2 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length2);
      });
    } else {
      this._prelimContent.splice(index, length2);
    }
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get(index) {
    return typeListGet(this, index);
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray() {
    return typeListToArray(this);
  }
  /**
   * Returns a portion of this YArray into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON() {
    return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
  }
  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map(f) {
    return typeListMap(
      this,
      /** @type {any} */
      f
    );
  }
  /**
   * Executes a provided function once on every element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach(f) {
    typeListForEach(this, f);
  }
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    return typeListCreateIterator(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(encoder) {
    encoder.writeTypeRef(YArrayRefID);
  }
};
var readYArray = (_decoder) => new YArray();
var YMapEvent = class extends YEvent {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor(ymap, transaction, subs) {
    super(ymap, transaction);
    this.keysChanged = subs;
  }
};
var YMap = class _YMap extends AbstractType {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor(entries) {
    super();
    this._prelimContent = null;
    if (entries === void 0) {
      this._prelimContent = /* @__PURE__ */ new Map();
    } else {
      this._prelimContent = new Map(entries);
    }
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(y, item) {
    super._integrate(y, item);
    this._prelimContent.forEach((value, key) => {
      this.set(key, value);
    });
    this._prelimContent = null;
  }
  /**
   * @return {YMap<MapType>}
   */
  _copy() {
    return new _YMap();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YMap<MapType>}
   */
  clone() {
    const map = new _YMap();
    this.forEach((value, key) => {
      map.set(key, value instanceof AbstractType ? (
        /** @type {typeof value} */
        value.clone()
      ) : value);
    });
    return map;
  }
  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
  }
  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,any>}
   */
  toJSON() {
    this.doc ?? warnPrematureAccess();
    const map = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];
        map[key] = v instanceof AbstractType ? v.toJSON() : v;
      }
    });
    return map;
  }
  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size() {
    return [...createMapIterator(this)].length;
  }
  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys() {
    return iteratorMap(
      createMapIterator(this),
      /** @param {any} v */
      (v) => v[0]
    );
  }
  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<MapType>}
   */
  values() {
    return iteratorMap(
      createMapIterator(this),
      /** @param {any} v */
      (v) => v[1].content.getContent()[v[1].length - 1]
    );
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  entries() {
    return iteratorMap(
      createMapIterator(this),
      /** @param {any} v */
      (v) => (
        /** @type {any} */
        [v[0], v[1].content.getContent()[v[1].length - 1]]
      )
    );
  }
  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(MapType,string,YMap<MapType>):void} f A function to execute on every element of this YArray.
   */
  forEach(f) {
    this.doc ?? warnPrematureAccess();
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        f(item.content.getContent()[item.length - 1], key, this);
      }
    });
  }
  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<[string, MapType]>}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete(key) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, key);
      });
    } else {
      this._prelimContent.delete(key);
    }
  }
  /**
   * Adds or updates an element with a specified key and value.
   * @template {MapType} VAL
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {VAL} value The value of the element to add
   * @return {VAL}
   */
  set(key, value) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(
          transaction,
          this,
          key,
          /** @type {any} */
          value
        );
      });
    } else {
      this._prelimContent.set(key, value);
    }
    return value;
  }
  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {MapType|undefined}
   */
  get(key) {
    return (
      /** @type {any} */
      typeMapGet(this, key)
    );
  }
  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has(key) {
    return typeMapHas(this, key);
  }
  /**
   * Removes all elements from this YMap.
   */
  clear() {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        this.forEach(function(_value, key, map) {
          typeMapDelete(transaction, map, key);
        });
      });
    } else {
      this._prelimContent.clear();
    }
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(encoder) {
    encoder.writeTypeRef(YMapRefID);
  }
};
var readYMap = (_decoder) => new YMap();
var equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat(a, b);
var ItemTextListPosition = class {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor(left, right, index, currentAttributes) {
    this.left = left;
    this.right = right;
    this.index = index;
    this.currentAttributes = currentAttributes;
  }
  /**
   * Only call this if you know that this.right is defined
   */
  forward() {
    if (this.right === null) {
      unexpectedCase();
    }
    switch (this.right.content.constructor) {
      case ContentFormat:
        if (!this.right.deleted) {
          updateCurrentAttributes(
            this.currentAttributes,
            /** @type {ContentFormat} */
            this.right.content
          );
        }
        break;
      default:
        if (!this.right.deleted) {
          this.index += this.right.length;
        }
        break;
    }
    this.left = this.right;
    this.right = this.right.right;
  }
};
var findNextPosition = (transaction, pos, count) => {
  while (pos.right !== null && count > 0) {
    switch (pos.right.content.constructor) {
      case ContentFormat:
        if (!pos.right.deleted) {
          updateCurrentAttributes(
            pos.currentAttributes,
            /** @type {ContentFormat} */
            pos.right.content
          );
        }
        break;
      default:
        if (!pos.right.deleted) {
          if (count < pos.right.length) {
            getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
          }
          pos.index += pos.right.length;
          count -= pos.right.length;
        }
        break;
    }
    pos.left = pos.right;
    pos.right = pos.right.right;
  }
  return pos;
};
var findPosition = (transaction, parent, index, useSearchMarker) => {
  const currentAttributes = /* @__PURE__ */ new Map();
  const marker = useSearchMarker ? findMarker(parent, index) : null;
  if (marker) {
    const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
    return findNextPosition(transaction, pos, index - marker.index);
  } else {
    const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
    return findNextPosition(transaction, pos, index);
  }
};
var insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
  while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(
    negatedAttributes.get(
      /** @type {ContentFormat} */
      currPos.right.content.key
    ),
    /** @type {ContentFormat} */
    currPos.right.content.value
  ))) {
    if (!currPos.right.deleted) {
      negatedAttributes.delete(
        /** @type {ContentFormat} */
        currPos.right.content.key
      );
    }
    currPos.forward();
  }
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  negatedAttributes.forEach((val, key) => {
    const left = currPos.left;
    const right = currPos.right;
    const nextFormat = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
    nextFormat.integrate(transaction, 0);
    currPos.right = nextFormat;
    currPos.forward();
  });
};
var updateCurrentAttributes = (currentAttributes, format) => {
  const { key, value } = format;
  if (value === null) {
    currentAttributes.delete(key);
  } else {
    currentAttributes.set(key, value);
  }
};
var minimizeAttributeChanges = (currPos, attributes) => {
  while (true) {
    if (currPos.right === null) {
      break;
    } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(
      attributes[
        /** @type {ContentFormat} */
        currPos.right.content.key
      ] ?? null,
      /** @type {ContentFormat} */
      currPos.right.content.value
    )) ;
    else {
      break;
    }
    currPos.forward();
  }
};
var insertAttributes = (transaction, parent, currPos, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const negatedAttributes = /* @__PURE__ */ new Map();
  for (const key in attributes) {
    const val = attributes[key];
    const currentVal = currPos.currentAttributes.get(key) ?? null;
    if (!equalAttrs(currentVal, val)) {
      negatedAttributes.set(key, currentVal);
      const { left, right } = currPos;
      currPos.right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
  }
  return negatedAttributes;
};
var insertText = (transaction, parent, currPos, text, attributes) => {
  currPos.currentAttributes.forEach((_val, key) => {
    if (attributes[key] === void 0) {
      attributes[key] = null;
    }
  });
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  const content = text.constructor === String ? new ContentString(
    /** @type {string} */
    text
  ) : text instanceof AbstractType ? new ContentType(text) : new ContentEmbed(text);
  let { left, right, index } = currPos;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
  }
  right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
  right.integrate(transaction, 0);
  currPos.right = right;
  currPos.index = index;
  currPos.forward();
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
var formatText = (transaction, parent, currPos, length2, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  iterationLoop: while (currPos.right !== null && (length2 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
    if (!currPos.right.deleted) {
      switch (currPos.right.content.constructor) {
        case ContentFormat: {
          const { key, value } = (
            /** @type {ContentFormat} */
            currPos.right.content
          );
          const attr = attributes[key];
          if (attr !== void 0) {
            if (equalAttrs(attr, value)) {
              negatedAttributes.delete(key);
            } else {
              if (length2 === 0) {
                break iterationLoop;
              }
              negatedAttributes.set(key, value);
            }
            currPos.right.delete(transaction);
          } else {
            currPos.currentAttributes.set(key, value);
          }
          break;
        }
        default:
          if (length2 < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
          }
          length2 -= currPos.right.length;
          break;
      }
    }
    currPos.forward();
  }
  if (length2 > 0) {
    let newlines = "";
    for (; length2 > 0; length2--) {
      newlines += "\n";
    }
    currPos.right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
    currPos.right.integrate(transaction, 0);
    currPos.forward();
  }
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};
var cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
  let end = start;
  const endFormats = create();
  while (end && (!end.countable || end.deleted)) {
    if (!end.deleted && end.content.constructor === ContentFormat) {
      const cf = (
        /** @type {ContentFormat} */
        end.content
      );
      endFormats.set(cf.key, cf);
    }
    end = end.right;
  }
  let cleanups = 0;
  let reachedCurr = false;
  while (start !== end) {
    if (curr === start) {
      reachedCurr = true;
    }
    if (!start.deleted) {
      const content = start.content;
      switch (content.constructor) {
        case ContentFormat: {
          const { key, value } = (
            /** @type {ContentFormat} */
            content
          );
          const startAttrValue = startAttributes.get(key) ?? null;
          if (endFormats.get(key) !== content || startAttrValue === value) {
            start.delete(transaction);
            cleanups++;
            if (!reachedCurr && (currAttributes.get(key) ?? null) === value && startAttrValue !== value) {
              if (startAttrValue === null) {
                currAttributes.delete(key);
              } else {
                currAttributes.set(key, startAttrValue);
              }
            }
          }
          if (!reachedCurr && !start.deleted) {
            updateCurrentAttributes(
              currAttributes,
              /** @type {ContentFormat} */
              content
            );
          }
          break;
        }
      }
    }
    start = /** @type {Item} */
    start.right;
  }
  return cleanups;
};
var cleanupContextlessFormattingGap = (transaction, item) => {
  while (item && item.right && (item.right.deleted || !item.right.countable)) {
    item = item.right;
  }
  const attrs = /* @__PURE__ */ new Set();
  while (item && (item.deleted || !item.countable)) {
    if (!item.deleted && item.content.constructor === ContentFormat) {
      const key = (
        /** @type {ContentFormat} */
        item.content.key
      );
      if (attrs.has(key)) {
        item.delete(transaction);
      } else {
        attrs.add(key);
      }
    }
    item = item.left;
  }
};
var cleanupYTextFormatting = (type) => {
  let res = 0;
  transact(
    /** @type {Doc} */
    type.doc,
    (transaction) => {
      let start = (
        /** @type {Item} */
        type._start
      );
      let end = type._start;
      let startAttributes = create();
      const currentAttributes = copy(startAttributes);
      while (end) {
        if (end.deleted === false) {
          switch (end.content.constructor) {
            case ContentFormat:
              updateCurrentAttributes(
                currentAttributes,
                /** @type {ContentFormat} */
                end.content
              );
              break;
            default:
              res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
              startAttributes = copy(currentAttributes);
              start = end;
              break;
          }
        }
        end = end.right;
      }
    }
  );
  return res;
};
var cleanupYTextAfterTransaction = (transaction) => {
  const needFullCleanup = /* @__PURE__ */ new Set();
  const doc = transaction.doc;
  for (const [client, afterClock] of transaction.afterState.entries()) {
    const clock = transaction.beforeState.get(client) || 0;
    if (afterClock === clock) {
      continue;
    }
    iterateStructs(
      transaction,
      /** @type {Array<Item|GC>} */
      doc.store.clients.get(client),
      clock,
      afterClock,
      (item) => {
        if (!item.deleted && /** @type {Item} */
        item.content.constructor === ContentFormat && item.constructor !== GC) {
          needFullCleanup.add(
            /** @type {any} */
            item.parent
          );
        }
      }
    );
  }
  transact(doc, (t) => {
    iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
      if (item instanceof GC || !/** @type {YText} */
      item.parent._hasFormatting || needFullCleanup.has(
        /** @type {YText} */
        item.parent
      )) {
        return;
      }
      const parent = (
        /** @type {YText} */
        item.parent
      );
      if (item.content.constructor === ContentFormat) {
        needFullCleanup.add(parent);
      } else {
        cleanupContextlessFormattingGap(t, item);
      }
    });
    for (const yText of needFullCleanup) {
      cleanupYTextFormatting(yText);
    }
  });
};
var deleteText = (transaction, currPos, length2) => {
  const startLength = length2;
  const startAttrs = copy(currPos.currentAttributes);
  const start = currPos.right;
  while (length2 > 0 && currPos.right !== null) {
    if (currPos.right.deleted === false) {
      switch (currPos.right.content.constructor) {
        case ContentType:
        case ContentEmbed:
        case ContentString:
          if (length2 < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length2));
          }
          length2 -= currPos.right.length;
          currPos.right.delete(transaction);
          break;
      }
    }
    currPos.forward();
  }
  if (start) {
    cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
  }
  const parent = (
    /** @type {AbstractType<any>} */
    /** @type {Item} */
    (currPos.left || currPos.right).parent
  );
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length2);
  }
  return currPos;
};
var YTextEvent = class extends YEvent {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor(ytext, transaction, subs) {
    super(ytext, transaction);
    this.childListChanged = false;
    this.keysChanged = /* @__PURE__ */ new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.keysChanged.add(sub);
      }
    });
  }
  /**
   * @type {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert?:Array<any>|string, delete?:number, retain?:number}>}}
   */
  get changes() {
    if (this._changes === null) {
      const changes = {
        keys: this.keys,
        delta: this.delta,
        added: /* @__PURE__ */ new Set(),
        deleted: /* @__PURE__ */ new Set()
      };
      this._changes = changes;
    }
    return (
      /** @type {any} */
      this._changes
    );
  }
  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<{insert?:string|object|AbstractType<any>, delete?:number, retain?:number, attributes?: Object<string,any>}>}
   *
   * @public
   */
  get delta() {
    if (this._delta === null) {
      const y = (
        /** @type {Doc} */
        this.target.doc
      );
      const delta = [];
      transact(y, (transaction) => {
        const currentAttributes = /* @__PURE__ */ new Map();
        const oldAttributes = /* @__PURE__ */ new Map();
        let item = this.target._start;
        let action = null;
        const attributes = {};
        let insert = "";
        let retain = 0;
        let deleteLen = 0;
        const addOp = () => {
          if (action !== null) {
            let op = null;
            switch (action) {
              case "delete":
                if (deleteLen > 0) {
                  op = { delete: deleteLen };
                }
                deleteLen = 0;
                break;
              case "insert":
                if (typeof insert === "object" || insert.length > 0) {
                  op = { insert };
                  if (currentAttributes.size > 0) {
                    op.attributes = {};
                    currentAttributes.forEach((value, key) => {
                      if (value !== null) {
                        op.attributes[key] = value;
                      }
                    });
                  }
                }
                insert = "";
                break;
              case "retain":
                if (retain > 0) {
                  op = { retain };
                  if (!isEmpty(attributes)) {
                    op.attributes = assign({}, attributes);
                  }
                }
                retain = 0;
                break;
            }
            if (op) delta.push(op);
            action = null;
          }
        };
        while (item !== null) {
          switch (item.content.constructor) {
            case ContentType:
            case ContentEmbed:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  addOp();
                  action = "insert";
                  insert = item.content.getContent()[0];
                  addOp();
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += 1;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += 1;
              }
              break;
            case ContentString:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  if (action !== "insert") {
                    addOp();
                    action = "insert";
                  }
                  insert += /** @type {ContentString} */
                  item.content.str;
                }
              } else if (this.deletes(item)) {
                if (action !== "delete") {
                  addOp();
                  action = "delete";
                }
                deleteLen += item.length;
              } else if (!item.deleted) {
                if (action !== "retain") {
                  addOp();
                  action = "retain";
                }
                retain += item.length;
              }
              break;
            case ContentFormat: {
              const { key, value } = (
                /** @type {ContentFormat} */
                item.content
              );
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  const curVal = currentAttributes.get(key) ?? null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (equalAttrs(value, oldAttributes.get(key) ?? null)) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else if (value !== null) {
                    item.delete(transaction);
                  }
                }
              } else if (this.deletes(item)) {
                oldAttributes.set(key, value);
                const curVal = currentAttributes.get(key) ?? null;
                if (!equalAttrs(curVal, value)) {
                  if (action === "retain") {
                    addOp();
                  }
                  attributes[key] = curVal;
                }
              } else if (!item.deleted) {
                oldAttributes.set(key, value);
                const attr = attributes[key];
                if (attr !== void 0) {
                  if (!equalAttrs(attr, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    if (value === null) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else if (attr !== null) {
                    item.delete(transaction);
                  }
                }
              }
              if (!item.deleted) {
                if (action === "insert") {
                  addOp();
                }
                updateCurrentAttributes(
                  currentAttributes,
                  /** @type {ContentFormat} */
                  item.content
                );
              }
              break;
            }
          }
          item = item.right;
        }
        addOp();
        while (delta.length > 0) {
          const lastOp = delta[delta.length - 1];
          if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
            delta.pop();
          } else {
            break;
          }
        }
      });
      this._delta = delta;
    }
    return (
      /** @type {any} */
      this._delta
    );
  }
};
var YText = class _YText extends AbstractType {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor(string) {
    super();
    this._pending = string !== void 0 ? [() => this.insert(0, string)] : [];
    this._searchMarker = [];
    this._hasFormatting = false;
  }
  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length() {
    this.doc ?? warnPrematureAccess();
    return this._length;
  }
  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate(y, item) {
    super._integrate(y, item);
    try {
      this._pending.forEach((f) => f());
    } catch (e) {
      console.error(e);
    }
    this._pending = null;
  }
  _copy() {
    return new _YText();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YText}
   */
  clone() {
    const text = new _YText();
    text.applyDelta(this.toDelta());
    return text;
  }
  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    const event = new YTextEvent(this, transaction, parentSubs);
    callTypeObservers(this, transaction, event);
    if (!transaction.local && this._hasFormatting) {
      transaction._needFormattingCleanup = true;
    }
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString() {
    this.doc ?? warnPrematureAccess();
    let str = "";
    let n = this._start;
    while (n !== null) {
      if (!n.deleted && n.countable && n.content.constructor === ContentString) {
        str += /** @type {ContentString} */
        n.content.str;
      }
      n = n.right;
    }
    return str;
  }
  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {Array<any>} delta The changes to apply on this element.
   * @param {object}  opts
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta(delta, { sanitize = true } = {}) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
        for (let i = 0; i < delta.length; i++) {
          const op = delta[i];
          if (op.insert !== void 0) {
            const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
            if (typeof ins !== "string" || ins.length > 0) {
              insertText(transaction, this, currPos, ins, op.attributes || {});
            }
          } else if (op.retain !== void 0) {
            formatText(transaction, this, currPos, op.retain, op.attributes || {});
          } else if (op.delete !== void 0) {
            deleteText(transaction, currPos, op.delete);
          }
        }
      });
    } else {
      this._pending.push(() => this.applyDelta(delta));
    }
  }
  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta(snapshot, prevSnapshot, computeYChange) {
    this.doc ?? warnPrematureAccess();
    const ops = [];
    const currentAttributes = /* @__PURE__ */ new Map();
    const doc = (
      /** @type {Doc} */
      this.doc
    );
    let str = "";
    let n = this._start;
    function packStr() {
      if (str.length > 0) {
        const attributes = {};
        let addAttributes = false;
        currentAttributes.forEach((value, key) => {
          addAttributes = true;
          attributes[key] = value;
        });
        const op = { insert: str };
        if (addAttributes) {
          op.attributes = attributes;
        }
        ops.push(op);
        str = "";
      }
    }
    const computeDelta = () => {
      while (n !== null) {
        if (isVisible(n, snapshot) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
          switch (n.content.constructor) {
            case ContentString: {
              const cur = currentAttributes.get("ychange");
              if (snapshot !== void 0 && !isVisible(n, snapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.type !== "removed") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                }
              } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                if (cur === void 0 || cur.user !== n.id.client || cur.type !== "added") {
                  packStr();
                  currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                }
              } else if (cur !== void 0) {
                packStr();
                currentAttributes.delete("ychange");
              }
              str += /** @type {ContentString} */
              n.content.str;
              break;
            }
            case ContentType:
            case ContentEmbed: {
              packStr();
              const op = {
                insert: n.content.getContent()[0]
              };
              if (currentAttributes.size > 0) {
                const attrs = (
                  /** @type {Object<string,any>} */
                  {}
                );
                op.attributes = attrs;
                currentAttributes.forEach((value, key) => {
                  attrs[key] = value;
                });
              }
              ops.push(op);
              break;
            }
            case ContentFormat:
              if (isVisible(n, snapshot)) {
                packStr();
                updateCurrentAttributes(
                  currentAttributes,
                  /** @type {ContentFormat} */
                  n.content
                );
              }
              break;
          }
        }
        n = n.right;
      }
      packStr();
    };
    if (snapshot || prevSnapshot) {
      transact(doc, (transaction) => {
        if (snapshot) {
          splitSnapshotAffectedStructs(transaction, snapshot);
        }
        if (prevSnapshot) {
          splitSnapshotAffectedStructs(transaction, prevSnapshot);
        }
        computeDelta();
      }, "cleanup");
    } else {
      computeDelta();
    }
    return ops;
  }
  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert(index, text, attributes) {
    if (text.length <= 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index, !attributes);
        if (!attributes) {
          attributes = {};
          pos.currentAttributes.forEach((v, k) => {
            attributes[k] = v;
          });
        }
        insertText(transaction, this, pos, text, attributes);
      });
    } else {
      this._pending.push(() => this.insert(index, text, attributes));
    }
  }
  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object | AbstractType<any>} embed The Object that represents the embed.
   * @param {TextAttributes} [attributes] Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed(index, embed, attributes) {
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index, !attributes);
        insertText(transaction, this, pos, embed, attributes || {});
      });
    } else {
      this._pending.push(() => this.insertEmbed(index, embed, attributes || {}));
    }
  }
  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete(index, length2) {
    if (length2 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        deleteText(transaction, findPosition(transaction, this, index, true), length2);
      });
    } else {
      this._pending.push(() => this.delete(index, length2));
    }
  }
  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format(index, length2, attributes) {
    if (length2 === 0) {
      return;
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, (transaction) => {
        const pos = findPosition(transaction, this, index, false);
        if (pos.right === null) {
          return;
        }
        formatText(transaction, this, pos, length2, attributes);
      });
    } else {
      this._pending.push(() => this.format(index, length2, attributes));
    }
  }
  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._pending.push(() => this.removeAttribute(attributeName));
    }
  }
  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._pending.push(() => this.setAttribute(attributeName, attributeValue));
    }
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute(attributeName) {
    return (
      /** @type {any} */
      typeMapGet(this, attributeName)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes() {
    return typeMapGetAll(this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(encoder) {
    encoder.writeTypeRef(YTextRefID);
  }
};
var readYText = (_decoder) => new YText();
var YXmlTreeWalker = class {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor(root, f = () => true) {
    this._filter = f;
    this._root = root;
    this._currentNode = /** @type {Item} */
    root._start;
    this._firstCall = true;
    root.doc ?? warnPrematureAccess();
  }
  [Symbol.iterator]() {
    return this;
  }
  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next() {
    let n = this._currentNode;
    let type = n && n.content && /** @type {any} */
    n.content.type;
    if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
      do {
        type = /** @type {any} */
        n.content.type;
        if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
          n = type._start;
        } else {
          while (n !== null) {
            const nxt = n.next;
            if (nxt !== null) {
              n = nxt;
              break;
            } else if (n.parent === this._root) {
              n = null;
            } else {
              n = /** @type {AbstractType<any>} */
              n.parent._item;
            }
          }
        }
      } while (n !== null && (n.deleted || !this._filter(
        /** @type {ContentType} */
        n.content.type
      )));
    }
    this._firstCall = false;
    if (n === null) {
      return { value: void 0, done: true };
    }
    this._currentNode = n;
    return { value: (
      /** @type {any} */
      n.content.type
    ), done: false };
  }
};
var YXmlFragment = class _YXmlFragment extends AbstractType {
  constructor() {
    super();
    this._prelimContent = [];
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild() {
    const first = this._first;
    return first ? first.content.getContent()[0] : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(y, item) {
    super._integrate(y, item);
    this.insert(
      0,
      /** @type {Array<any>} */
      this._prelimContent
    );
    this._prelimContent = null;
  }
  _copy() {
    return new _YXmlFragment();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlFragment}
   */
  clone() {
    const el = new _YXmlFragment();
    el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
    return el;
  }
  get length() {
    this.doc ?? warnPrematureAccess();
    return this._prelimContent === null ? this._length : this._prelimContent.length;
  }
  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker(filter) {
    return new YXmlTreeWalker(this, filter);
  }
  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector(query2) {
    query2 = query2.toUpperCase();
    const iterator = new YXmlTreeWalker(this, (element) => element.nodeName && element.nodeName.toUpperCase() === query2);
    const next = iterator.next();
    if (next.done) {
      return null;
    } else {
      return next.value;
    }
  }
  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll(query2) {
    query2 = query2.toUpperCase();
    return from(new YXmlTreeWalker(this, (element) => element.nodeName && element.nodeName.toUpperCase() === query2));
  }
  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver(transaction, parentSubs) {
    callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
  }
  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString() {
    return typeListMap(this, (xml) => xml.toString()).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(_document = document, hooks = {}, binding) {
    const fragment = _document.createDocumentFragment();
    if (binding !== void 0) {
      binding._createAssociation(fragment, this);
    }
    typeListForEach(this, (xmlType) => {
      fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
    });
    return fragment;
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert(index, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      this._prelimContent.splice(index, 0, ...content);
    }
  }
  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter(ref, content) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
        typeListInsertGenericsAfter(transaction, this, refItem, content);
      });
    } else {
      const pc = (
        /** @type {Array<any>} */
        this._prelimContent
      );
      const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
      if (index === 0 && ref !== null) {
        throw create3("Reference item not found");
      }
      pc.splice(index, 0, ...content);
    }
  }
  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete(index, length2 = 1) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeListDelete(transaction, this, index, length2);
      });
    } else {
      this._prelimContent.splice(index, length2);
    }
  }
  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray() {
    return typeListToArray(this);
  }
  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push(content) {
    this.insert(this.length, content);
  }
  /**
   * Prepends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to prepend.
   */
  unshift(content) {
    this.insert(0, content);
  }
  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get(index) {
    return typeListGet(this, index);
  }
  /**
   * Returns a portion of this YXmlFragment into a JavaScript Array selected
   * from start to end (end not included).
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice(start = 0, end = this.length) {
    return typeListSlice(this, start, end);
  }
  /**
   * Executes a provided function on once on every child element.
   *
   * @param {function(YXmlElement|YXmlText,number, typeof self):void} f A function to execute on every element of this YArray.
   */
  forEach(f) {
    typeListForEach(this, f);
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(encoder) {
    encoder.writeTypeRef(YXmlFragmentRefID);
  }
};
var readYXmlFragment = (_decoder) => new YXmlFragment();
var YXmlElement = class _YXmlElement extends YXmlFragment {
  constructor(nodeName = "UNDEFINED") {
    super();
    this.nodeName = nodeName;
    this._prelimAttrs = /* @__PURE__ */ new Map();
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const n = this._item ? this._item.next : null;
    return n ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      n.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const n = this._item ? this._item.prev : null;
    return n ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      n.content.type
    ) : null;
  }
  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate(y, item) {
    super._integrate(y, item);
    /** @type {Map<string, any>} */
    this._prelimAttrs.forEach((value, key) => {
      this.setAttribute(key, value);
    });
    this._prelimAttrs = null;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy() {
    return new _YXmlElement(this.nodeName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlElement<KV>}
   */
  clone() {
    const el = new _YXmlElement(this.nodeName);
    const attrs = this.getAttributes();
    forEach(attrs, (value, key) => {
      el.setAttribute(
        key,
        /** @type {any} */
        value
      );
    });
    el.insert(0, this.toArray().map((v) => v instanceof AbstractType ? v.clone() : v));
    return el;
  }
  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString() {
    const attrs = this.getAttributes();
    const stringBuilder = [];
    const keys2 = [];
    for (const key in attrs) {
      keys2.push(key);
    }
    keys2.sort();
    const keysLen = keys2.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys2[i];
      stringBuilder.push(key + '="' + attrs[key] + '"');
    }
    const nodeName = this.nodeName.toLocaleLowerCase();
    const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
    return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
  }
  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {string} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute(attributeName) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      this._prelimAttrs.delete(attributeName);
    }
  }
  /**
   * Sets or updates an attribute.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that is to be set.
   * @param {KV[KEY]} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute(attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, (transaction) => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      this._prelimAttrs.set(attributeName, attributeValue);
    }
  }
  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @template {keyof KV & string} KEY
   *
   * @param {KEY} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {KV[KEY]|undefined} The queried attribute value.
   *
   * @public
   */
  getAttribute(attributeName) {
    return (
      /** @type {any} */
      typeMapGet(this, attributeName)
    );
  }
  /**
   * Returns whether an attribute exists
   *
   * @param {string} attributeName The attribute name to check for existence.
   * @return {boolean} whether the attribute exists.
   *
   * @public
   */
  hasAttribute(attributeName) {
    return (
      /** @type {any} */
      typeMapHas(this, attributeName)
    );
  }
  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {{ [Key in Extract<keyof KV,string>]?: KV[Key]}} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes(snapshot) {
    return (
      /** @type {any} */
      snapshot ? typeMapGetAllSnapshot(this, snapshot) : typeMapGetAll(this)
    );
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(_document = document, hooks = {}, binding) {
    const dom = _document.createElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      const value = attrs[key];
      if (typeof value === "string") {
        dom.setAttribute(key, value);
      }
    }
    typeListForEach(this, (yxml) => {
      dom.appendChild(yxml.toDOM(_document, hooks, binding));
    });
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(encoder) {
    encoder.writeTypeRef(YXmlElementRefID);
    encoder.writeKey(this.nodeName);
  }
};
var readYXmlElement = (decoder) => new YXmlElement(decoder.readKey());
var YXmlEvent = class extends YEvent {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with which the
   *                                  change was created.
   */
  constructor(target, subs, transaction) {
    super(target, transaction);
    this.childListChanged = false;
    this.attributesChanged = /* @__PURE__ */ new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.attributesChanged.add(sub);
      }
    });
  }
};
var YXmlHook = class _YXmlHook extends YMap {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor(hookName) {
    super();
    this.hookName = hookName;
  }
  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy() {
    return new _YXmlHook(this.hookName);
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlHook}
   */
  clone() {
    const el = new _YXmlHook(this.hookName);
    this.forEach((value, key) => {
      el.set(key, value);
    });
    return el;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(_document = document, hooks = {}, binding) {
    const hook = hooks[this.hookName];
    let dom;
    if (hook !== void 0) {
      dom = hook.createDom(this);
    } else {
      dom = document.createElement(this.hookName);
    }
    dom.setAttribute("data-yjs-hook", this.hookName);
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   */
  _write(encoder) {
    encoder.writeTypeRef(YXmlHookRefID);
    encoder.writeKey(this.hookName);
  }
};
var readYXmlHook = (decoder) => new YXmlHook(decoder.readKey());
var YXmlText = class _YXmlText extends YText {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling() {
    const n = this._item ? this._item.next : null;
    return n ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      n.content.type
    ) : null;
  }
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling() {
    const n = this._item ? this._item.prev : null;
    return n ? (
      /** @type {YXmlElement|YXmlText} */
      /** @type {ContentType} */
      n.content.type
    ) : null;
  }
  _copy() {
    return new _YXmlText();
  }
  /**
   * Makes a copy of this data type that can be included somewhere else.
   *
   * Note that the content is only readable _after_ it has been included somewhere in the Ydoc.
   *
   * @return {YXmlText}
   */
  clone() {
    const text = new _YXmlText();
    text.applyDelta(this.toDelta());
    return text;
  }
  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM(_document = document, hooks, binding) {
    const dom = _document.createTextNode(this.toString());
    if (binding !== void 0) {
      binding._createAssociation(dom, this);
    }
    return dom;
  }
  toString() {
    return this.toDelta().map((delta) => {
      const nestedNodes = [];
      for (const nodeName in delta.attributes) {
        const attrs = [];
        for (const key in delta.attributes[nodeName]) {
          attrs.push({ key, value: delta.attributes[nodeName][key] });
        }
        attrs.sort((a, b) => a.key < b.key ? -1 : 1);
        nestedNodes.push({ nodeName, attrs });
      }
      nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
      let str = "";
      for (let i = 0; i < nestedNodes.length; i++) {
        const node = nestedNodes[i];
        str += `<${node.nodeName}`;
        for (let j = 0; j < node.attrs.length; j++) {
          const attr = node.attrs[j];
          str += ` ${attr.key}="${attr.value}"`;
        }
        str += ">";
      }
      str += delta.insert;
      for (let i = nestedNodes.length - 1; i >= 0; i--) {
        str += `</${nestedNodes[i].nodeName}>`;
      }
      return str;
    }).join("");
  }
  /**
   * @return {string}
   */
  toJSON() {
    return this.toString();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   */
  _write(encoder) {
    encoder.writeTypeRef(YXmlTextRefID);
  }
};
var readYXmlText = (decoder) => new YXmlText();
var AbstractStruct = class {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor(id2, length2) {
    this.id = id2;
    this.length = length2;
  }
  /**
   * @type {boolean}
   */
  get deleted() {
    throw methodUnimplemented();
  }
  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} whether this merged with right
   */
  mergeWith(right) {
    return false;
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write(encoder, offset, encodingRef) {
    throw methodUnimplemented();
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(transaction, offset) {
    throw methodUnimplemented();
  }
};
var structGCRefNumber = 0;
var GC = class extends AbstractStruct {
  get deleted() {
    return true;
  }
  delete() {
  }
  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith(right) {
    if (this.constructor !== right.constructor) {
      return false;
    }
    this.length += right.length;
    return true;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.length -= offset;
    }
    addStruct(transaction.doc.store, this);
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeInfo(structGCRefNumber);
    encoder.writeLen(this.length - offset);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(transaction, store) {
    return null;
  }
};
var ContentBinary = class _ContentBinary {
  /**
   * @param {Uint8Array} content
   */
  constructor(content) {
    this.content = content;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.content];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return true;
  }
  /**
   * @return {ContentBinary}
   */
  copy() {
    return new _ContentBinary(this.content);
  }
  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice(offset) {
    throw methodUnimplemented();
  }
  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith(right) {
    return false;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeBuf(this.content);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 3;
  }
};
var readContentBinary = (decoder) => new ContentBinary(decoder.readBuf());
var ContentDeleted = class _ContentDeleted {
  /**
   * @param {number} len
   */
  constructor(len) {
    this.len = len;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.len;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return false;
  }
  /**
   * @return {ContentDeleted}
   */
  copy() {
    return new _ContentDeleted(this.len);
  }
  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice(offset) {
    const right = new _ContentDeleted(this.len - offset);
    this.len = offset;
    return right;
  }
  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith(right) {
    this.len += right.len;
    return true;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
    addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
    item.markDeleted();
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeLen(this.len - offset);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 1;
  }
};
var readContentDeleted = (decoder) => new ContentDeleted(decoder.readLen());
var createDocFromOpts = (guid, opts) => new Doc({ guid, ...opts, shouldLoad: opts.shouldLoad || opts.autoLoad || false });
var ContentDoc = class _ContentDoc {
  /**
   * @param {Doc} doc
   */
  constructor(doc) {
    if (doc._item) {
      console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
    }
    this.doc = doc;
    const opts = {};
    this.opts = opts;
    if (!doc.gc) {
      opts.gc = false;
    }
    if (doc.autoLoad) {
      opts.autoLoad = true;
    }
    if (doc.meta !== null) {
      opts.meta = doc.meta;
    }
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.doc];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return true;
  }
  /**
   * @return {ContentDoc}
   */
  copy() {
    return new _ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
  }
  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice(offset) {
    throw methodUnimplemented();
  }
  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith(right) {
    return false;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
    this.doc._item = item;
    transaction.subdocsAdded.add(this.doc);
    if (this.doc.shouldLoad) {
      transaction.subdocsLoaded.add(this.doc);
    }
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
    if (transaction.subdocsAdded.has(this.doc)) {
      transaction.subdocsAdded.delete(this.doc);
    } else {
      transaction.subdocsRemoved.add(this.doc);
    }
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeString(this.doc.guid);
    encoder.writeAny(this.opts);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 9;
  }
};
var readContentDoc = (decoder) => new ContentDoc(createDocFromOpts(decoder.readString(), decoder.readAny()));
var ContentEmbed = class _ContentEmbed {
  /**
   * @param {Object} embed
   */
  constructor(embed) {
    this.embed = embed;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.embed];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return true;
  }
  /**
   * @return {ContentEmbed}
   */
  copy() {
    return new _ContentEmbed(this.embed);
  }
  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice(offset) {
    throw methodUnimplemented();
  }
  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith(right) {
    return false;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeJSON(this.embed);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 5;
  }
};
var readContentEmbed = (decoder) => new ContentEmbed(decoder.readJSON());
var ContentFormat = class _ContentFormat {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return false;
  }
  /**
   * @return {ContentFormat}
   */
  copy() {
    return new _ContentFormat(this.key, this.value);
  }
  /**
   * @param {number} _offset
   * @return {ContentFormat}
   */
  splice(_offset) {
    throw methodUnimplemented();
  }
  /**
   * @param {ContentFormat} _right
   * @return {boolean}
   */
  mergeWith(_right) {
    return false;
  }
  /**
   * @param {Transaction} _transaction
   * @param {Item} item
   */
  integrate(_transaction, item) {
    const p = (
      /** @type {YText} */
      item.parent
    );
    p._searchMarker = null;
    p._hasFormatting = true;
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeKey(this.key);
    encoder.writeJSON(this.value);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 6;
  }
};
var readContentFormat = (decoder) => new ContentFormat(decoder.readKey(), decoder.readJSON());
var ContentJSON = class _ContentJSON {
  /**
   * @param {Array<any>} arr
   */
  constructor(arr) {
    this.arr = arr;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return true;
  }
  /**
   * @return {ContentJSON}
   */
  copy() {
    return new _ContentJSON(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice(offset) {
    const right = new _ContentJSON(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right;
  }
  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith(right) {
    this.arr = this.arr.concat(right.arr);
    return true;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeString(c === void 0 ? "undefined" : JSON.stringify(c));
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 2;
  }
};
var readContentJSON = (decoder) => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    const c = decoder.readString();
    if (c === "undefined") {
      cs.push(void 0);
    } else {
      cs.push(JSON.parse(c));
    }
  }
  return new ContentJSON(cs);
};
var isDevMode = getVariable("node_env") === "development";
var ContentAny = class _ContentAny {
  /**
   * @param {Array<any>} arr
   */
  constructor(arr) {
    this.arr = arr;
    isDevMode && deepFreeze(arr);
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.arr.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.arr;
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return true;
  }
  /**
   * @return {ContentAny}
   */
  copy() {
    return new _ContentAny(this.arr);
  }
  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice(offset) {
    const right = new _ContentAny(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right;
  }
  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith(right) {
    this.arr = this.arr.concat(right.arr);
    return true;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeAny(c);
    }
  }
  /**
   * @return {number}
   */
  getRef() {
    return 8;
  }
};
var readContentAny = (decoder) => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    cs.push(decoder.readAny());
  }
  return new ContentAny(cs);
};
var ContentString = class _ContentString {
  /**
   * @param {string} str
   */
  constructor(str) {
    this.str = str;
  }
  /**
   * @return {number}
   */
  getLength() {
    return this.str.length;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return this.str.split("");
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return true;
  }
  /**
   * @return {ContentString}
   */
  copy() {
    return new _ContentString(this.str);
  }
  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice(offset) {
    const right = new _ContentString(this.str.slice(offset));
    this.str = this.str.slice(0, offset);
    const firstCharCode = this.str.charCodeAt(offset - 1);
    if (firstCharCode >= 55296 && firstCharCode <= 56319) {
      this.str = this.str.slice(0, offset - 1) + "\uFFFD";
      right.str = "\uFFFD" + right.str.slice(1);
    }
    return right;
  }
  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith(right) {
    this.str += right.str;
    return true;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
  }
  /**
   * @return {number}
   */
  getRef() {
    return 4;
  }
};
var readContentString = (decoder) => new ContentString(decoder.readString());
var typeRefs = [
  readYArray,
  readYMap,
  readYText,
  readYXmlElement,
  readYXmlFragment,
  readYXmlHook,
  readYXmlText
];
var YArrayRefID = 0;
var YMapRefID = 1;
var YTextRefID = 2;
var YXmlElementRefID = 3;
var YXmlFragmentRefID = 4;
var YXmlHookRefID = 5;
var YXmlTextRefID = 6;
var ContentType = class _ContentType {
  /**
   * @param {AbstractType<any>} type
   */
  constructor(type) {
    this.type = type;
  }
  /**
   * @return {number}
   */
  getLength() {
    return 1;
  }
  /**
   * @return {Array<any>}
   */
  getContent() {
    return [this.type];
  }
  /**
   * @return {boolean}
   */
  isCountable() {
    return true;
  }
  /**
   * @return {ContentType}
   */
  copy() {
    return new _ContentType(this.type._copy());
  }
  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice(offset) {
    throw methodUnimplemented();
  }
  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith(right) {
    return false;
  }
  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate(transaction, item) {
    this.type._integrate(transaction.doc, item);
  }
  /**
   * @param {Transaction} transaction
   */
  delete(transaction) {
    let item = this.type._start;
    while (item !== null) {
      if (!item.deleted) {
        item.delete(transaction);
      } else if (item.id.clock < (transaction.beforeState.get(item.id.client) || 0)) {
        transaction._mergeStructs.push(item);
      }
      item = item.right;
    }
    this.type._map.forEach((item2) => {
      if (!item2.deleted) {
        item2.delete(transaction);
      } else if (item2.id.clock < (transaction.beforeState.get(item2.id.client) || 0)) {
        transaction._mergeStructs.push(item2);
      }
    });
    transaction.changed.delete(this.type);
  }
  /**
   * @param {StructStore} store
   */
  gc(store) {
    let item = this.type._start;
    while (item !== null) {
      item.gc(store, true);
      item = item.right;
    }
    this.type._start = null;
    this.type._map.forEach(
      /** @param {Item | null} item */
      (item2) => {
        while (item2 !== null) {
          item2.gc(store, true);
          item2 = item2.left;
        }
      }
    );
    this.type._map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    this.type._write(encoder);
  }
  /**
   * @return {number}
   */
  getRef() {
    return 7;
  }
};
var readContentType = (decoder) => new ContentType(typeRefs[decoder.readTypeRef()](decoder));
var splitItem = (transaction, leftItem, diff) => {
  const { client, clock } = leftItem.id;
  const rightItem = new Item(
    createID(client, clock + diff),
    leftItem,
    createID(client, clock + diff - 1),
    leftItem.right,
    leftItem.rightOrigin,
    leftItem.parent,
    leftItem.parentSub,
    leftItem.content.splice(diff)
  );
  if (leftItem.deleted) {
    rightItem.markDeleted();
  }
  if (leftItem.keep) {
    rightItem.keep = true;
  }
  if (leftItem.redone !== null) {
    rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
  }
  leftItem.right = rightItem;
  if (rightItem.right !== null) {
    rightItem.right.left = rightItem;
  }
  transaction._mergeStructs.push(rightItem);
  if (rightItem.parentSub !== null && rightItem.right === null) {
    rightItem.parent._map.set(rightItem.parentSub, rightItem);
  }
  leftItem.length = diff;
  return rightItem;
};
var Item = class _Item extends AbstractStruct {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor(id2, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id2, content.getLength());
    this.origin = origin;
    this.left = left;
    this.right = right;
    this.rightOrigin = rightOrigin;
    this.parent = parent;
    this.parentSub = parentSub;
    this.redone = null;
    this.content = content;
    this.info = this.content.isCountable() ? BIT2 : 0;
  }
  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker(isMarked) {
    if ((this.info & BIT4) > 0 !== isMarked) {
      this.info ^= BIT4;
    }
  }
  get marker() {
    return (this.info & BIT4) > 0;
  }
  /**
   * If true, do not garbage collect this Item.
   */
  get keep() {
    return (this.info & BIT1) > 0;
  }
  set keep(doKeep) {
    if (this.keep !== doKeep) {
      this.info ^= BIT1;
    }
  }
  get countable() {
    return (this.info & BIT2) > 0;
  }
  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted() {
    return (this.info & BIT3) > 0;
  }
  set deleted(doDelete) {
    if (this.deleted !== doDelete) {
      this.info ^= BIT3;
    }
  }
  markDeleted() {
    this.info |= BIT3;
  }
  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(transaction, store) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
      return this.origin.client;
    }
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
      return this.rightOrigin.client;
    }
    if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
      return this.parent.client;
    }
    if (this.origin) {
      this.left = getItemCleanEnd(transaction, store, this.origin);
      this.origin = this.left.lastId;
    }
    if (this.rightOrigin) {
      this.right = getItemCleanStart(transaction, this.rightOrigin);
      this.rightOrigin = this.right.id;
    }
    if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
      this.parent = null;
    } else if (!this.parent) {
      if (this.left && this.left.constructor === _Item) {
        this.parent = this.left.parent;
        this.parentSub = this.left.parentSub;
      } else if (this.right && this.right.constructor === _Item) {
        this.parent = this.right.parent;
        this.parentSub = this.right.parentSub;
      }
    } else if (this.parent.constructor === ID) {
      const parentItem = getItem(store, this.parent);
      if (parentItem.constructor === GC) {
        this.parent = null;
      } else {
        this.parent = /** @type {ContentType} */
        parentItem.content.type;
      }
    }
    return null;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
      this.origin = this.left.lastId;
      this.content = this.content.splice(offset);
      this.length -= offset;
    }
    if (this.parent) {
      if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
        let left = this.left;
        let o;
        if (left !== null) {
          o = left.right;
        } else if (this.parentSub !== null) {
          o = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null;
          while (o !== null && o.left !== null) {
            o = o.left;
          }
        } else {
          o = /** @type {AbstractType<any>} */
          this.parent._start;
        }
        const conflictingItems = /* @__PURE__ */ new Set();
        const itemsBeforeOrigin = /* @__PURE__ */ new Set();
        while (o !== null && o !== this.right) {
          itemsBeforeOrigin.add(o);
          conflictingItems.add(o);
          if (compareIDs(this.origin, o.origin)) {
            if (o.id.client < this.id.client) {
              left = o;
              conflictingItems.clear();
            } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
              break;
            }
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
            if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
              left = o;
              conflictingItems.clear();
            }
          } else {
            break;
          }
          o = o.right;
        }
        this.left = left;
      }
      if (this.left !== null) {
        const right = this.left.right;
        this.right = right;
        this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null) {
          r = /** @type {AbstractType<any>} */
          this.parent._map.get(this.parentSub) || null;
          while (r !== null && r.left !== null) {
            r = r.left;
          }
        } else {
          r = /** @type {AbstractType<any>} */
          this.parent._start;
          this.parent._start = this;
        }
        this.right = r;
      }
      if (this.right !== null) {
        this.right.left = this;
      } else if (this.parentSub !== null) {
        this.parent._map.set(this.parentSub, this);
        if (this.left !== null) {
          this.left.delete(transaction);
        }
      }
      if (this.parentSub === null && this.countable && !this.deleted) {
        this.parent._length += this.length;
      }
      addStruct(transaction.doc.store, this);
      this.content.integrate(transaction, this);
      addChangedTypeToTransaction(
        transaction,
        /** @type {AbstractType<any>} */
        this.parent,
        this.parentSub
      );
      if (
        /** @type {AbstractType<any>} */
        this.parent._item !== null && /** @type {AbstractType<any>} */
        this.parent._item.deleted || this.parentSub !== null && this.right !== null
      ) {
        this.delete(transaction);
      }
    } else {
      new GC(this.id, this.length).integrate(transaction, 0);
    }
  }
  /**
   * Returns the next non-deleted item
   */
  get next() {
    let n = this.right;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n;
  }
  /**
   * Returns the previous non-deleted item
   */
  get prev() {
    let n = this.left;
    while (n !== null && n.deleted) {
      n = n.left;
    }
    return n;
  }
  /**
   * Computes the last content address of this Item.
   */
  get lastId() {
    return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
  }
  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith(right) {
    if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
      const searchMarker = (
        /** @type {AbstractType<any>} */
        this.parent._searchMarker
      );
      if (searchMarker) {
        searchMarker.forEach((marker) => {
          if (marker.p === right) {
            marker.p = this;
            if (!this.deleted && this.countable) {
              marker.index -= this.length;
            }
          }
        });
      }
      if (right.keep) {
        this.keep = true;
      }
      this.right = right.right;
      if (this.right !== null) {
        this.right.left = this;
      }
      this.length += right.length;
      return true;
    }
    return false;
  }
  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete(transaction) {
    if (!this.deleted) {
      const parent = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (this.countable && this.parentSub === null) {
        parent._length -= this.length;
      }
      this.markDeleted();
      addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
      addChangedTypeToTransaction(transaction, parent, this.parentSub);
      this.content.delete(transaction);
    }
  }
  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc(store, parentGCd) {
    if (!this.deleted) {
      throw unexpectedCase();
    }
    this.content.gc(store);
    if (parentGCd) {
      replaceStruct(store, this, new GC(this.id, this.length));
    } else {
      this.content = new ContentDeleted(this.length);
    }
  }
  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder The encoder to write data to.
   * @param {number} offset
   */
  write(encoder, offset) {
    const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
    const rightOrigin = this.rightOrigin;
    const parentSub = this.parentSub;
    const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | // origin is defined
    (rightOrigin === null ? 0 : BIT7) | // right origin is defined
    (parentSub === null ? 0 : BIT6);
    encoder.writeInfo(info);
    if (origin !== null) {
      encoder.writeLeftID(origin);
    }
    if (rightOrigin !== null) {
      encoder.writeRightID(rightOrigin);
    }
    if (origin === null && rightOrigin === null) {
      const parent = (
        /** @type {AbstractType<any>} */
        this.parent
      );
      if (parent._item !== void 0) {
        const parentItem = parent._item;
        if (parentItem === null) {
          const ykey = findRootTypeKey(parent);
          encoder.writeParentInfo(true);
          encoder.writeString(ykey);
        } else {
          encoder.writeParentInfo(false);
          encoder.writeLeftID(parentItem.id);
        }
      } else if (parent.constructor === String) {
        encoder.writeParentInfo(true);
        encoder.writeString(parent);
      } else if (parent.constructor === ID) {
        encoder.writeParentInfo(false);
        encoder.writeLeftID(parent);
      } else {
        unexpectedCase();
      }
      if (parentSub !== null) {
        encoder.writeString(parentSub);
      }
    }
    this.content.write(encoder, offset);
  }
};
var readItemContent = (decoder, info) => contentRefs[info & BITS5](decoder);
var contentRefs = [
  () => {
    unexpectedCase();
  },
  // GC is not ItemContent
  readContentDeleted,
  // 1
  readContentJSON,
  // 2
  readContentBinary,
  // 3
  readContentString,
  // 4
  readContentEmbed,
  // 5
  readContentFormat,
  // 6
  readContentType,
  // 7
  readContentAny,
  // 8
  readContentDoc,
  // 9
  () => {
    unexpectedCase();
  }
  // 10 - Skip is not ItemContent
];
var structSkipRefNumber = 10;
var Skip = class extends AbstractStruct {
  get deleted() {
    return true;
  }
  delete() {
  }
  /**
   * @param {Skip} right
   * @return {boolean}
   */
  mergeWith(right) {
    if (this.constructor !== right.constructor) {
      return false;
    }
    this.length += right.length;
    return true;
  }
  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate(transaction, offset) {
    unexpectedCase();
  }
  /**
   * @param {UpdateEncoderV1 | UpdateEncoderV2} encoder
   * @param {number} offset
   */
  write(encoder, offset) {
    encoder.writeInfo(structSkipRefNumber);
    writeVarUint(encoder.restEncoder, this.length - offset);
  }
  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing(transaction, store) {
    return null;
  }
};
var glo = (
  /** @type {any} */
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}
);
var importIdentifier = "__ $YJS$ __";
if (glo[importIdentifier] === true) {
  console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438");
}
glo[importIdentifier] = true;

// ../extensions/excalidraw/src/collab/seed.ts
var EMPTY_FILE = {
  type: "excalidraw",
  version: 2,
  source: "https://excalidraw.com",
  elements: [],
  appState: {},
  files: {}
};
function isExcalidrawYDocEmpty(yDoc) {
  return yDoc.getArray("elements").length === 0 && yDoc.getMap("assets").size === 0 && yDoc.getMap("appState").size === 0;
}
function seedExcalidrawYDoc(yDoc, content) {
  const file = parseExcalidrawFile(content);
  const yElements = yDoc.getArray("elements");
  const yAssets = yDoc.getMap("assets");
  const yAppState = yDoc.getMap("appState");
  const elements = file.elements ?? [];
  if (elements.length > 0) {
    const keys2 = generateNKeysBetween(null, null, elements.length);
    for (let i = 0; i < elements.length; i++) {
      const m = new YMap();
      m.set("el", { ...elements[i] });
      m.set("pos", keys2[i]);
      yElements.push([m]);
    }
  }
  const assets = file.files ?? {};
  for (const [fileId, data] of Object.entries(assets)) {
    yAssets.set(fileId, data);
  }
  if (file.appState && typeof file.appState === "object") {
    for (const [k, v] of Object.entries(file.appState)) {
      if (k === "viewBackgroundColor" || k === "gridSize" || k === "theme") {
        yAppState.set(k, v);
      }
    }
  }
}
function parseExcalidrawFile(content) {
  if (typeof content !== "string") {
    try {
      const text = new TextDecoder().decode(content);
      return JSON.parse(text);
    } catch {
      return EMPTY_FILE;
    }
  }
  if (!content.trim()) return EMPTY_FILE;
  try {
    return JSON.parse(content);
  } catch {
    return EMPTY_FILE;
  }
}

// ../extensions/excalidraw/src/collab/ExcalidrawCollabContentAdapter.ts
function decodeSource(source) {
  if (typeof source === "string") return source;
  try {
    return new TextDecoder("utf-8").decode(source);
  } catch {
    return "";
  }
}
function projectAppState(yAppState) {
  const out = {};
  yAppState.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}
function projectAssets(yAssets) {
  const out = {};
  yAssets.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}
function projectToFile(yDoc) {
  const yElements = yDoc.getArray("elements");
  const yAssets = yDoc.getMap("assets");
  const yAppState = yDoc.getMap("appState");
  return {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements: yjsToExcalidraw(yElements),
    appState: projectAppState(yAppState),
    files: projectAssets(yAssets)
  };
}
var ExcalidrawCollabContentAdapter = {
  documentType: "excalidraw",
  fileExtensions: [".excalidraw"],
  mimeType: "application/json",
  layoutVersion: 1,
  isEmpty(yDoc) {
    return isExcalidrawYDocEmpty(yDoc);
  },
  seedFromFile(yDoc, source) {
    const text = decodeSource(source);
    yDoc.transact(() => {
      seedExcalidrawYDoc(yDoc, text);
    });
  },
  applyFromFile(yDoc, source) {
    const text = decodeSource(source);
    yDoc.transact(() => {
      const yElements = yDoc.getArray("elements");
      const yAssets = yDoc.getMap("assets");
      const yAppState = yDoc.getMap("appState");
      if (yElements.length > 0) yElements.delete(0, yElements.length);
      yAssets.forEach((_, key) => yAssets.delete(key));
      yAppState.forEach((_, key) => yAppState.delete(key));
      seedExcalidrawYDoc(yDoc, text);
    });
  },
  exportToFile(yDoc) {
    return JSON.stringify(projectToFile(yDoc), null, 2);
  },
  toPlainText(yDoc) {
    const file = projectToFile(yDoc);
    const labels = [];
    for (const element of file.elements) {
      const e = element;
      if (typeof e.text === "string" && e.text.length > 0) labels.push(e.text);
      if (e.label?.text) labels.push(e.label.text);
    }
    return labels.join("\n");
  }
};

// ../extensions/csv-spreadsheet/src/collab/seed.ts
var Y_CSV_TEXT = "csv";
function getYCsv(yDoc) {
  return yDoc.getText(Y_CSV_TEXT);
}
function isCsvYDocEmpty(yDoc) {
  return getYCsv(yDoc).length === 0;
}
function seedCsvYDoc(yDoc, content) {
  const text = typeof content === "string" ? content : decodeBuffer(content);
  if (!text) return;
  const yText = getYCsv(yDoc);
  if (yText.length > 0) return;
  yText.insert(0, text);
}
function decodeBuffer(buf) {
  try {
    return new TextDecoder().decode(buf);
  } catch {
    return "";
  }
}

// ../extensions/csv-spreadsheet/src/collab/CsvCollabContentAdapter.ts
function decodeSource2(source) {
  if (typeof source === "string") return source;
  try {
    return new TextDecoder("utf-8").decode(source);
  } catch {
    return "";
  }
}
var CsvCollabContentAdapter = {
  documentType: "csv",
  // The Y.Text carries the file verbatim, tabs included; the editor resolves
  // the delimiter from that text on every load, so TSV needs no separate type.
  fileExtensions: [".csv", ".tsv"],
  mimeType: "text/csv",
  layoutVersion: 1,
  isEmpty(yDoc) {
    return isCsvYDocEmpty(yDoc);
  },
  seedFromFile(yDoc, source) {
    seedCsvYDoc(yDoc, typeof source === "string" ? source : source.buffer.slice(
      source.byteOffset,
      source.byteOffset + source.byteLength
    ));
  },
  applyFromFile(yDoc, source) {
    const text = decodeSource2(source);
    yDoc.transact(() => {
      const yText = yDoc.getText(Y_CSV_TEXT);
      if (yText.length > 0) {
        yText.delete(0, yText.length);
      }
      if (text.length > 0) {
        yText.insert(0, text);
      }
    });
  },
  exportToFile(yDoc) {
    return getYCsv(yDoc).toString();
  },
  toPlainText(yDoc) {
    return getYCsv(yDoc).toString();
  }
};

// ../extensions/datamodellm/node_modules/nanoid/index.js
import { webcrypto as crypto2 } from "node:crypto";

// ../extensions/datamodellm/node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// ../extensions/datamodellm/node_modules/nanoid/index.js
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
function fillPool(bytes) {
  if (bytes < 0) throw new RangeError("Wrong ID size");
  try {
    if (!pool || pool.length < bytes) {
      pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
      crypto2.getRandomValues(pool);
      poolOffset = 0;
    } else if (poolOffset + bytes > pool.length) {
      crypto2.getRandomValues(pool);
      poolOffset = 0;
    }
  } catch (e) {
    pool = void 0;
    throw e;
  }
  poolOffset += bytes;
}
function nanoid(size2 = 21) {
  fillPool(size2 |= 0);
  let id2 = "";
  for (let i = poolOffset - size2; i < poolOffset; i++) {
    id2 += urlAlphabet[pool[i] & 63];
  }
  return id2;
}

// ../extensions/datamodellm/src/prismaParser.ts
function parsePrismaSchema(content) {
  const lines = content.split("\n");
  const metadata = extractNimbalystMetadata(content);
  const datasource = parseDatasource(content);
  const database = mapProviderToDatabase(datasource?.provider);
  const models = parseModels(lines);
  const types = parseTypes(lines);
  const entities = convertModelsToEntities(models, types, metadata.positions);
  const relationships = extractRelationships(models, entities);
  return {
    version: 1,
    database,
    entities,
    relationships,
    viewport: metadata.viewport,
    entityViewMode: metadata.entityViewMode || "standard"
  };
}
function extractNimbalystMetadata(content) {
  const defaultMetadata = {
    viewport: { x: 0, y: 0, zoom: 1 },
    positions: {}
  };
  const match = content.match(/\/\/\s*@nimbalyst\s+({.+})/);
  if (!match) return defaultMetadata;
  try {
    const parsed = JSON.parse(match[1]);
    return {
      viewport: parsed.viewport || defaultMetadata.viewport,
      positions: parsed.positions || {},
      entityViewMode: parsed.entityViewMode
    };
  } catch {
    console.warn("[DatamodelLM] Failed to parse @nimbalyst metadata");
    return defaultMetadata;
  }
}
function parseDatasource(content) {
  const match = content.match(/datasource\s+\w+\s*\{([^}]+)\}/);
  if (!match) return null;
  const providerMatch = match[1].match(/provider\s*=\s*"(\w+)"/);
  return providerMatch ? { provider: providerMatch[1] } : null;
}
function mapProviderToDatabase(provider) {
  switch (provider) {
    case "postgresql":
      return "postgres";
    case "mysql":
      return "mysql";
    case "sqlite":
      return "sqlite";
    case "mongodb":
      return "mongodb";
    case "cockroachdb":
      return "postgres";
    // CockroachDB is PostgreSQL-compatible
    default:
      return "postgres";
  }
}
function parseModels(lines) {
  const models = [];
  let currentModel = null;
  let braceDepth = 0;
  let pendingDescription = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      continue;
    }
    if (trimmed.startsWith("///")) {
      const docText = trimmed.slice(3).trim();
      pendingDescription.push(docText);
      continue;
    }
    if (trimmed.startsWith("//")) {
      if (!trimmed.includes("@nimbalyst")) {
        pendingDescription = [];
      }
      continue;
    }
    const modelMatch = trimmed.match(/^model\s+(\w+)\s*\{/);
    if (modelMatch) {
      currentModel = {
        name: modelMatch[1],
        fields: [],
        attributes: [],
        description: pendingDescription.length > 0 ? pendingDescription.join(" ") : void 0
      };
      braceDepth = 1;
      pendingDescription = [];
      continue;
    }
    if (!currentModel) {
      pendingDescription = [];
    }
    if (currentModel) {
      braceDepth += (trimmed.match(/\{/g) || []).length;
      braceDepth -= (trimmed.match(/\}/g) || []).length;
      if (braceDepth === 0) {
        models.push(currentModel);
        currentModel = null;
        pendingDescription = [];
        continue;
      }
      if (trimmed.startsWith("@@")) {
        currentModel.attributes.push(trimmed);
        pendingDescription = [];
        continue;
      }
      const field = parseFieldLine(trimmed, pendingDescription.length > 0 ? pendingDescription.join(" ") : void 0);
      if (field) {
        currentModel.fields.push(field);
      }
      pendingDescription = [];
    }
  }
  return models;
}
function parseFieldLine(line, pendingDescription) {
  let inlineDescription;
  const commentIndex = line.indexOf("//");
  let fieldPart = line;
  if (commentIndex !== -1) {
    inlineDescription = line.slice(commentIndex + 2).trim();
    fieldPart = line.slice(0, commentIndex).trim();
  }
  if (!fieldPart) return null;
  const match = fieldPart.match(/^(\w+)\s+(\w+)(\?)?(\[\])?\s*(.*)/);
  if (!match) return null;
  const [, name, type, optional, array, attributesStr] = match;
  const attributes = [];
  const attrRegex = /@\w+(?:\([^)]*\))?/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
    attributes.push(attrMatch[0]);
  }
  const description = pendingDescription || inlineDescription;
  return {
    name,
    type,
    isOptional: !!optional,
    isArray: !!array,
    attributes,
    description
  };
}
function parseTypes(lines) {
  const types = [];
  let currentType = null;
  let braceDepth = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed === "") continue;
    const typeMatch = trimmed.match(/^type\s+(\w+)\s*\{/);
    if (typeMatch) {
      currentType = { name: typeMatch[1], fields: [] };
      braceDepth = 1;
      continue;
    }
    if (currentType) {
      braceDepth += (trimmed.match(/\{/g) || []).length;
      braceDepth -= (trimmed.match(/\}/g) || []).length;
      if (braceDepth === 0) {
        types.push(currentType);
        currentType = null;
        continue;
      }
      const field = parseFieldLine(trimmed);
      if (field) {
        currentType.fields.push(field);
      }
    }
  }
  return types;
}
function convertModelsToEntities(models, types, positions) {
  const typeMap = new Map(types.map((t) => [t.name, t]));
  return models.map((model, index) => {
    const position = positions[model.name] || {
      x: 100 + index % 4 * 350,
      y: 100 + Math.floor(index / 4) * 300
    };
    const fields = model.fields.filter((f) => !isRelationField(f, models)).map((f) => convertPrismaFieldToField(f, typeMap));
    return {
      id: nanoid(),
      name: model.name,
      fields,
      position,
      description: model.description
    };
  });
}
function isRelationField(field, models) {
  const modelNames = new Set(models.map((m) => m.name));
  return modelNames.has(field.type);
}
function convertPrismaFieldToField(prismaField, typeMap) {
  const field = {
    id: nanoid(),
    name: prismaField.name,
    dataType: mapPrismaTypeToDataType(prismaField.type),
    isNullable: prismaField.isOptional,
    isArray: prismaField.isArray,
    description: prismaField.description
  };
  if (prismaField.attributes.some((a) => a === "@id")) {
    field.isPrimaryKey = true;
  }
  if (prismaField.attributes.some((a) => a === "@unique")) {
  }
  const defaultMatch = prismaField.attributes.find((a) => a.startsWith("@default"));
  if (defaultMatch) {
    const valueMatch = defaultMatch.match(/@default\((.+)\)/);
    if (valueMatch) {
      field.defaultValue = valueMatch[1];
    }
  }
  const embeddedType = typeMap.get(prismaField.type);
  if (embeddedType) {
    field.isEmbedded = true;
    field.embeddedSchema = embeddedType.fields.map(
      (f) => convertPrismaFieldToField(f, typeMap)
    );
  }
  return field;
}
function mapPrismaTypeToDataType(prismaType) {
  const typeMap = {
    String: "string",
    Int: "integer",
    BigInt: "bigint",
    Float: "float",
    Decimal: "decimal",
    Boolean: "boolean",
    DateTime: "timestamp",
    Json: "json",
    Bytes: "bytes"
  };
  return typeMap[prismaType] || prismaType.toLowerCase();
}
function extractRelationships(models, _entities) {
  const relationships = [];
  const modelNames = new Set(models.map((m) => m.name));
  const processedPairs = /* @__PURE__ */ new Set();
  for (const model of models) {
    for (const field of model.fields) {
      if (!modelNames.has(field.type)) continue;
      const pairKey = [model.name, field.type].sort().join("|");
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);
      const relationAttr = field.attributes.find((a) => a.startsWith("@relation"));
      let sourceFieldName;
      let targetFieldName;
      let onDelete;
      let onUpdate;
      if (relationAttr) {
        const fieldsMatch = relationAttr.match(/fields:\s*\[([^\]]+)\]/);
        const referencesMatch = relationAttr.match(/references:\s*\[([^\]]+)\]/);
        const onDeleteMatch = relationAttr.match(/onDelete:\s*(\w+)/);
        const onUpdateMatch = relationAttr.match(/onUpdate:\s*(\w+)/);
        if (fieldsMatch) {
          sourceFieldName = fieldsMatch[1].trim();
        }
        if (referencesMatch) {
          targetFieldName = referencesMatch[1].trim();
        }
        if (onDeleteMatch) {
          onDelete = mapCascadeAction(onDeleteMatch[1]);
        }
        if (onUpdateMatch) {
          onUpdate = mapCascadeAction(onUpdateMatch[1]);
        }
      }
      let type = "1:N";
      if (field.isArray) {
        const otherModel = models.find((m) => m.name === field.type);
        const reverseField = otherModel?.fields.find((f) => f.type === model.name);
        if (reverseField?.isArray) {
          type = "N:M";
        }
      } else {
        const otherModel = models.find((m) => m.name === field.type);
        const reverseField = otherModel?.fields.find((f) => f.type === model.name);
        if (!reverseField?.isArray) {
          type = "1:1";
        }
      }
      relationships.push({
        id: nanoid(),
        type,
        sourceEntityName: model.name,
        targetEntityName: field.type,
        sourceFieldName,
        targetFieldName,
        onDelete,
        onUpdate
      });
    }
  }
  return relationships;
}
function mapCascadeAction(action) {
  const actionMap = {
    Cascade: "CASCADE",
    SetNull: "SET NULL",
    Restrict: "RESTRICT",
    NoAction: "NO ACTION"
  };
  return actionMap[action] || "NO ACTION";
}
function serializeToPrismaSchema(model) {
  const lines = [];
  const metadata = {
    viewport: model.viewport,
    positions: Object.fromEntries(
      model.entities.map((e) => [e.name, e.position])
    ),
    entityViewMode: model.entityViewMode
  };
  lines.push(`// @nimbalyst ${JSON.stringify(metadata)}`);
  lines.push("");
  lines.push("datasource db {");
  lines.push(`  provider = "${mapDatabaseToProvider(model.database)}"`);
  lines.push('  url      = env("DATABASE_URL")');
  lines.push("}");
  lines.push("");
  const embeddedTypes = /* @__PURE__ */ new Map();
  for (const entity of model.entities) {
    for (const field of entity.fields) {
      if (field.isEmbedded && field.embeddedSchema) {
        embeddedTypes.set(field.dataType, field.embeddedSchema);
      }
    }
  }
  for (const [typeName, fields] of embeddedTypes) {
    lines.push(`type ${typeName} {`);
    for (const field of fields) {
      lines.push(`  ${serializeField(field)}`);
    }
    lines.push("}");
    lines.push("");
  }
  for (const entity of model.entities) {
    if (entity.description) {
      lines.push(`/// ${entity.description}`);
    }
    lines.push(`model ${entity.name} {`);
    for (const field of entity.fields) {
      if (field.description) {
        lines.push(`  /// ${field.description}`);
      }
      lines.push(`  ${serializeField(field)}`);
    }
    const relatedRelationships = model.relationships.filter(
      (r) => r.sourceEntityName === entity.name || r.targetEntityName === entity.name
    );
    for (const rel of relatedRelationships) {
      const isSource = rel.sourceEntityName === entity.name;
      const otherEntityName = isSource ? rel.targetEntityName : rel.sourceEntityName;
      if (isSource && rel.sourceFieldName) {
        const relationType = rel.type === "1:1" ? otherEntityName : `${otherEntityName}`;
        const relationAttr = buildRelationAttribute(rel);
        lines.push(`  ${camelCase(otherEntityName)} ${relationType}${relationAttr ? " " + relationAttr : ""}`);
      } else if (!isSource) {
        const isMany = rel.type === "1:N" || rel.type === "N:M";
        const relationType = isMany ? `${rel.sourceEntityName}[]` : rel.sourceEntityName;
        lines.push(`  ${camelCase(rel.sourceEntityName)}${isMany ? "s" : ""} ${relationType}`);
      }
    }
    lines.push("}");
    lines.push("");
  }
  return lines.join("\n");
}
function mapDatabaseToProvider(database) {
  switch (database) {
    case "postgres":
      return "postgresql";
    case "mysql":
      return "mysql";
    case "sqlite":
      return "sqlite";
    case "mongodb":
      return "mongodb";
    case "couchdb":
      return "mongodb";
    // CouchDB not supported, fallback to MongoDB
    default:
      return "postgresql";
  }
}
function serializeField(field) {
  let line = field.name;
  line = line.padEnd(12);
  let type = mapDataTypeToPrismaType(field.dataType);
  if (field.isEmbedded) {
    type = capitalizeFirst(field.dataType);
  }
  if (field.isArray) {
    type += "[]";
  }
  if (field.isNullable) {
    type += "?";
  }
  line += type;
  const attrs = [];
  if (field.isPrimaryKey) {
    attrs.push("@id");
  }
  if (field.defaultValue) {
    attrs.push(`@default(${field.defaultValue})`);
  }
  if (attrs.length > 0) {
    line = line.padEnd(24);
    line += attrs.join(" ");
  }
  return line;
}
function mapDataTypeToPrismaType(dataType) {
  const typeMap = {
    string: "String",
    integer: "Int",
    bigint: "BigInt",
    float: "Float",
    decimal: "Decimal",
    boolean: "Boolean",
    timestamp: "DateTime",
    json: "Json",
    bytes: "Bytes",
    uuid: "String",
    text: "String"
  };
  return typeMap[dataType] || capitalizeFirst(dataType);
}
function buildRelationAttribute(rel) {
  const parts = [];
  if (rel.sourceFieldName) {
    parts.push(`fields: [${rel.sourceFieldName}]`);
  }
  if (rel.targetFieldName) {
    parts.push(`references: [${rel.targetFieldName}]`);
  }
  if (rel.onDelete && rel.onDelete !== "NO ACTION") {
    parts.push(`onDelete: ${mapCascadeActionToPrisma(rel.onDelete)}`);
  }
  if (rel.onUpdate && rel.onUpdate !== "NO ACTION") {
    parts.push(`onUpdate: ${mapCascadeActionToPrisma(rel.onUpdate)}`);
  }
  return parts.length > 0 ? `@relation(${parts.join(", ")})` : "";
}
function mapCascadeActionToPrisma(action) {
  const actionMap = {
    CASCADE: "Cascade",
    "SET NULL": "SetNull",
    RESTRICT: "Restrict",
    "NO ACTION": "NoAction"
  };
  return actionMap[action];
}
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function camelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// ../extensions/datamodellm/src/collab/seed.ts
var Y_ENTITIES_KEY = "entities";
var Y_RELATIONSHIPS_KEY = "relationships";
var Y_META_KEY = "meta";
var DOC_VERSION = 1;
function entityStableId(name) {
  return `e_${name}`;
}
function fieldStableId(entityName, fieldName) {
  return `f_${entityName}__${fieldName}`;
}
function relationshipStableId(rel) {
  return `r_${rel.sourceEntityName}__${rel.targetEntityName}__${rel.sourceFieldName ?? ""}__${rel.targetFieldName ?? ""}`;
}
function isDataModelYDocEmpty(yDoc) {
  return yDoc.getMap(Y_META_KEY).size === 0 && yDoc.getMap(Y_ENTITIES_KEY).size === 0 && yDoc.getMap(Y_RELATIONSHIPS_KEY).size === 0;
}
function decodeContent(content) {
  if (typeof content === "string") return content;
  try {
    return new TextDecoder().decode(content);
  } catch {
    return "";
  }
}
function seedDataModelYDoc(yDoc, content) {
  const text = decodeContent(content);
  const file = text.trim() ? safeParse(text) : {
    version: 1,
    database: "postgres",
    entities: [],
    relationships: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    entityViewMode: "standard"
  };
  const yEntities = yDoc.getMap(Y_ENTITIES_KEY);
  const yRelationships = yDoc.getMap(Y_RELATIONSHIPS_KEY);
  const yMeta = yDoc.getMap(Y_META_KEY);
  yMeta.set("database", file.database);
  yMeta.set("entityViewMode", file.entityViewMode);
  yMeta.set("version", DOC_VERSION);
  for (const entity of file.entities) {
    const stableId = entityStableId(entity.name);
    if (yEntities.has(stableId)) continue;
    const yEntity = new YMap();
    yEntity.set("id", stableId);
    yEntity.set("name", entity.name);
    if (entity.description !== void 0) {
      yEntity.set("description", entity.description);
    }
    if (entity.color !== void 0) {
      yEntity.set("color", entity.color);
    }
    yEntity.set("position", { x: entity.position.x, y: entity.position.y });
    yEntity.set("fields", stabiliseFieldIds(entity.name, entity.fields));
    if (entity.indexes) {
      yEntity.set("indexes", entity.indexes.map((idx) => ({ ...idx })));
    }
    yEntities.set(stableId, yEntity);
  }
  for (const rel of file.relationships) {
    const stableId = relationshipStableId(rel);
    if (yRelationships.has(stableId)) continue;
    const yRel = new YMap();
    yRel.set("id", stableId);
    yRel.set("type", rel.type);
    yRel.set("sourceEntityName", rel.sourceEntityName);
    yRel.set("targetEntityName", rel.targetEntityName);
    if (rel.name !== void 0) yRel.set("name", rel.name);
    if (rel.sourceFieldName !== void 0) yRel.set("sourceFieldName", rel.sourceFieldName);
    if (rel.targetFieldName !== void 0) yRel.set("targetFieldName", rel.targetFieldName);
    if (rel.onDelete !== void 0) yRel.set("onDelete", rel.onDelete);
    if (rel.onUpdate !== void 0) yRel.set("onUpdate", rel.onUpdate);
    if (rel.implementationType !== void 0) yRel.set("implementationType", rel.implementationType);
    yRelationships.set(stableId, yRel);
  }
}
function safeParse(text) {
  try {
    return parsePrismaSchema(text);
  } catch {
    return {
      version: 1,
      database: "postgres",
      entities: [],
      relationships: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      entityViewMode: "standard"
    };
  }
}
function stabiliseFieldIds(entityName, fields) {
  return fields.map((f) => {
    const next = { ...f, id: fieldStableId(entityName, f.name) };
    if (f.embeddedSchema) {
      next.embeddedSchema = stabiliseFieldIds(`${entityName}__${f.name}`, f.embeddedSchema);
    }
    return next;
  });
}

// ../extensions/datamodellm/src/collab/datamodelBinding.ts
function cloneField(f) {
  const next = { ...f };
  if (f.embeddedSchema) {
    next.embeddedSchema = f.embeddedSchema.map(cloneField);
  }
  return next;
}
function cloneIndex(i) {
  return { ...i, fields: i.fields.map((f) => ({ ...f })) };
}
function yMapToEntity(yEntity) {
  const id2 = yEntity.get("id") ?? "";
  const name = yEntity.get("name") ?? "";
  const description = yEntity.get("description");
  const color = yEntity.get("color");
  const position = yEntity.get("position") ?? { x: 0, y: 0 };
  const fields = (yEntity.get("fields") ?? []).map(cloneField);
  const indexes = yEntity.get("indexes");
  return {
    id: id2,
    name,
    description,
    color,
    position: { x: position.x, y: position.y },
    fields,
    indexes: indexes ? indexes.map(cloneIndex) : void 0
  };
}
function yMapToRelationship(yRel) {
  return {
    id: yRel.get("id") ?? "",
    type: yRel.get("type"),
    sourceEntityName: yRel.get("sourceEntityName") ?? "",
    targetEntityName: yRel.get("targetEntityName") ?? "",
    name: yRel.get("name"),
    sourceFieldName: yRel.get("sourceFieldName"),
    targetFieldName: yRel.get("targetFieldName"),
    onDelete: yRel.get("onDelete"),
    onUpdate: yRel.get("onUpdate"),
    implementationType: yRel.get("implementationType")
  };
}

// ../extensions/datamodellm/src/collab/DataModelCollabContentAdapter.ts
function projectFile(yDoc) {
  const yEntities = yDoc.getMap(Y_ENTITIES_KEY);
  const yRelationships = yDoc.getMap(Y_RELATIONSHIPS_KEY);
  const yMeta = yDoc.getMap(Y_META_KEY);
  const entities = [];
  yEntities.forEach((yEntity) => {
    entities.push(yMapToEntity(yEntity));
  });
  const relationships = [];
  yRelationships.forEach((yRel) => {
    relationships.push(yMapToRelationship(yRel));
  });
  const database = yMeta.get("database") ?? "postgres";
  const entityViewMode = yMeta.get("entityViewMode") ?? "standard";
  return {
    version: 1,
    database,
    entities,
    relationships,
    // Viewport is per-client and not stored in the Y.Doc; default
    // for export.
    viewport: { x: 0, y: 0, zoom: 1 },
    entityViewMode
  };
}
var DataModelCollabContentAdapter = {
  documentType: "datamodel",
  fileExtensions: [".prisma"],
  mimeType: "text/plain",
  layoutVersion: 1,
  isEmpty(yDoc) {
    return isDataModelYDocEmpty(yDoc);
  },
  seedFromFile(yDoc, source) {
    yDoc.transact(() => {
      seedDataModelYDoc(yDoc, typeof source === "string" ? source : source.buffer.slice(
        source.byteOffset,
        source.byteOffset + source.byteLength
      ));
    });
  },
  applyFromFile(yDoc, source) {
    yDoc.transact(() => {
      const yEntities = yDoc.getMap(Y_ENTITIES_KEY);
      const yRelationships = yDoc.getMap(Y_RELATIONSHIPS_KEY);
      const yMeta = yDoc.getMap(Y_META_KEY);
      yEntities.forEach((_, key) => yEntities.delete(key));
      yRelationships.forEach((_, key) => yRelationships.delete(key));
      yMeta.forEach((_, key) => yMeta.delete(key));
      seedDataModelYDoc(yDoc, typeof source === "string" ? source : source.buffer.slice(
        source.byteOffset,
        source.byteOffset + source.byteLength
      ));
    });
  },
  exportToFile(yDoc) {
    return serializeToPrismaSchema(projectFile(yDoc));
  },
  toPlainText(yDoc) {
    return serializeToPrismaSchema(projectFile(yDoc));
  }
};

// ../extensions/mockuplm/src/collab/seed.ts
var Y_MOCKUP_HTML = "html";
var Y_MOCKUP_PINS = "mockupPins";
function getYMockupText(yDoc) {
  return yDoc.getText(Y_MOCKUP_HTML);
}
function getYMockupPins(yDoc) {
  return yDoc.getMap(Y_MOCKUP_PINS);
}
function isMockupYDocEmpty(yDoc) {
  return getYMockupText(yDoc).length === 0;
}
function seedMockupYDoc(yDoc, content) {
  getYMockupPins(yDoc);
  const text = typeof content === "string" ? content : decodeBuffer2(content);
  if (!text) return;
  const yText = getYMockupText(yDoc);
  if (yText.length > 0) return;
  yText.insert(0, text);
}
function decodeBuffer2(buf) {
  try {
    return new TextDecoder().decode(buf);
  } catch {
    return "";
  }
}

// ../extensions/mockuplm/src/utils/generateSelector.ts
function escapeIdentifier(value) {
  const nativeEscape = globalThis.CSS?.escape;
  if (nativeEscape) return nativeEscape(value);
  if (value === "-") return "\\-";
  return Array.from(value, (character, index) => {
    const codePoint = character.codePointAt(0);
    const isControl = codePoint <= 31 || codePoint === 127;
    const isLeadingDigit = index === 0 && /[0-9]/.test(character);
    const isSecondDigitAfterDash = index === 1 && value[0] === "-" && /[0-9]/.test(character);
    if (isControl || isLeadingDigit || isSecondDigitAfterDash) {
      return `\\${codePoint.toString(16)} `;
    }
    if (codePoint === 0) return "\uFFFD";
    if (codePoint >= 128 || /[A-Za-z0-9_-]/.test(character)) return character;
    return `\\${character}`;
  }).join("");
}
function selectsOnly(root, selector, element) {
  try {
    const matches = root.querySelectorAll(selector);
    return matches.length === 1 && matches[0] === element;
  } catch {
    return false;
  }
}
function generateSelector(element) {
  const root = element.ownerDocument;
  if (element.id) {
    const idSelector = `#${escapeIdentifier(element.id)}`;
    if (selectsOnly(root, idSelector, element)) return idSelector;
  }
  const classSelectors = Array.from(
    element.classList,
    (name) => `.${escapeIdentifier(name)}`
  );
  for (const selector of classSelectors) {
    if (selectsOnly(root, selector, element)) return selector;
  }
  if (classSelectors.length > 1) {
    const combined = classSelectors.join("");
    if (selectsOnly(root, combined, element)) return combined;
  }
  const path = [];
  let current = element;
  while (current) {
    const node = current;
    let segment = node.localName;
    const parent = node.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter(
        (sibling) => sibling.localName === node.localName
      );
      if (sameTag.length > 1) {
        segment += `:nth-of-type(${sameTag.indexOf(node) + 1})`;
      }
    }
    path.unshift(segment);
    const selector = path.join(" > ");
    if (selectsOnly(root, selector, element)) return selector;
    current = parent;
  }
  return path.join(" > ") || element.localName;
}

// ../extensions/mockuplm/src/comments/resolveMockupPin.ts
function createLabelSnapshot(element) {
  const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
  return `${element.localName}:${text}`;
}
function query(document2, selector) {
  try {
    return Array.from(document2.querySelectorAll(selector));
  } catch {
    return [];
  }
}
function labelMatches(document2, labelSnapshot) {
  return Array.from(document2.querySelectorAll("*")).filter(
    (element) => createLabelSnapshot(element) === labelSnapshot
  );
}
function isHidden(element) {
  for (let current = element; current; current = current.parentElement) {
    if (current.hasAttribute("hidden")) return true;
    const htmlElement = current;
    if (htmlElement.style?.display === "none") return true;
    if (htmlElement.style?.visibility === "hidden" || htmlElement.style?.visibility === "collapse") {
      return true;
    }
    const view = current.ownerDocument.defaultView;
    if (view) {
      const style = view.getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") {
        return true;
      }
    }
  }
  return false;
}
function matched(target, selectorUpdate) {
  return {
    status: isHidden(target) ? "hidden" : selectorUpdate ? "healed" : "attached",
    target,
    referenceBox: "element",
    selectorUpdate
  };
}
function resolveMockupPin(document2, pin) {
  if (pin.selector !== null) {
    const selectorMatches = query(document2, pin.selector);
    if (selectorMatches.length === 1) return matched(selectorMatches[0], null);
    const matches = labelMatches(document2, pin.labelSnapshot);
    if (matches.length === 1) {
      const target = matches[0];
      const repairedSelector = generateSelector(target);
      const repairedMatches = query(document2, repairedSelector);
      if (repairedMatches.length === 1 && repairedMatches[0] === target) {
        return matched(target, repairedSelector);
      }
    }
  }
  if (pin.selector === null) {
    return {
      status: "attached",
      target: null,
      referenceBox: "document",
      selectorUpdate: null
    };
  }
  return {
    status: "detached",
    target: null,
    referenceBox: "element",
    selectorUpdate: null
  };
}

// ../extensions/mockuplm/src/comments/mockupPinAnchor.ts
var MOCKUP_PIN_ENTITY_TYPE = "mockup-pin";
var MAX_LABEL_CHARS = 60;
function isMockupPinAnchor(anchor) {
  return anchor?.kind === "entity" && anchor.entityType === MOCKUP_PIN_ENTITY_TYPE;
}
function mockupPinIdFromAnchor(anchor) {
  return isMockupPinAnchor(anchor) ? anchor.entityId || null : null;
}
function describeMockupPinTarget(labelSnapshot) {
  const separator = labelSnapshot.indexOf(":");
  if (separator === -1) return labelSnapshot.trim() || "empty space";
  const tag = labelSnapshot.slice(0, separator).trim();
  const text = labelSnapshot.slice(separator + 1).trim();
  if (!tag && !text) return "empty space";
  if (!text) return tag;
  const clipped = text.length > MAX_LABEL_CHARS ? `${text.slice(0, MAX_LABEL_CHARS - 1).trimEnd()}\u2026` : text;
  return tag ? `${clipped} ${tag}` : clipped;
}

// ../extensions/mockuplm/src/collab/MockupCollabContentAdapters.ts
function parseMockupHtml(yDoc) {
  return new DOMParser().parseFromString(
    getYMockupText(yDoc).toString(),
    "text/html"
  );
}
function decodeSource3(source) {
  if (typeof source === "string") return source;
  try {
    return new TextDecoder("utf-8").decode(source);
  } catch {
    return "";
  }
}
var MockupHtmlCollabContentAdapter = {
  documentType: "mockup.html",
  fileExtensions: [".mockup.html"],
  mimeType: "text/html",
  layoutVersion: 1,
  isEmpty(yDoc) {
    return isMockupYDocEmpty(yDoc);
  },
  seedFromFile(yDoc, source) {
    seedMockupYDoc(yDoc, typeof source === "string" ? source : source.buffer.slice(
      source.byteOffset,
      source.byteOffset + source.byteLength
    ));
  },
  applyFromFile(yDoc, source) {
    const text = decodeSource3(source);
    yDoc.transact(() => {
      const yText = yDoc.getText(Y_MOCKUP_HTML);
      if (yText.length > 0) yText.delete(0, yText.length);
      if (text.length > 0) yText.insert(0, text);
    });
  },
  exportToFile(yDoc) {
    return getYMockupText(yDoc).toString();
  },
  toPlainText(yDoc) {
    return getYMockupText(yDoc).toString();
  },
  commentAnchors: {
    handles(anchor) {
      return isMockupPinAnchor(anchor);
    },
    getState(yDoc, anchor) {
      const pinId = mockupPinIdFromAnchor(anchor);
      const pin = pinId ? getYMockupPins(yDoc).get(pinId) : void 0;
      if (!pin) return "orphaned";
      return resolveMockupPin(parseMockupHtml(yDoc), pin).status === "detached" ? "orphaned" : "attached";
    },
    describe(yDoc, anchor) {
      const pinId = mockupPinIdFromAnchor(anchor);
      const pin = pinId ? getYMockupPins(yDoc).get(pinId) : void 0;
      const labelSnapshot = pin?.labelSnapshot ?? (isMockupPinAnchor(anchor) ? anchor.labelSnapshot ?? "" : "");
      return describeMockupPinTarget(labelSnapshot);
    }
  }
};

// ../extension-sdk/dist/collab/createTextCollabContentAdapter.js
var TEXT_COLLAB_DEFAULT_FIELD = "content";
function decodeSource4(source) {
  if (typeof source === "string")
    return source;
  try {
    return new TextDecoder("utf-8").decode(source);
  } catch {
    return "";
  }
}
function createTextCollabContentAdapter(options) {
  const field = options.textField ?? TEXT_COLLAB_DEFAULT_FIELD;
  const layoutVersion = options.layoutVersion ?? 1;
  const getText = (yDoc) => yDoc.getText(field);
  return {
    documentType: options.documentType,
    fileExtensions: options.fileExtensions,
    mimeType: options.mimeType,
    layoutVersion,
    // Lets the host rebuild this adapter in another process (e.g. Electron
    // main) without loading the extension. See reconstruct fn below.
    serializableDescriptor: {
      kind: "text",
      documentType: options.documentType,
      fileExtensions: options.fileExtensions,
      mimeType: options.mimeType,
      textField: field,
      layoutVersion
    },
    isEmpty(yDoc) {
      return getText(yDoc).length === 0;
    },
    seedFromFile(yDoc, source) {
      const text = decodeSource4(source);
      if (!text)
        return;
      const yText = getText(yDoc);
      if (yText.length > 0)
        return;
      yText.insert(0, text);
    },
    applyFromFile(yDoc, source) {
      const text = decodeSource4(source);
      yDoc.transact(() => {
        const yText = getText(yDoc);
        if (yText.length > 0)
          yText.delete(0, yText.length);
        if (text.length > 0)
          yText.insert(0, text);
      });
    },
    exportToFile(yDoc) {
      return getText(yDoc).toString();
    },
    toPlainText(yDoc) {
      return getText(yDoc).toString();
    }
  };
}

// ../extensions/calc-sheets/src/collab/CalcSheetCollabContentAdapter.ts
var CALC_SHEET_TEXT_FIELD = "content";
var CalcSheetCollabContentAdapter = createTextCollabContentAdapter({
  documentType: "calc.md",
  fileExtensions: [".calc.md"],
  mimeType: "text/markdown",
  textField: CALC_SHEET_TEXT_FIELD
});

// ../../../nimbalyst-mindmap/src/collab/yShape.ts
var Y_NODES = "nodes";
var Y_META = "meta";
var META_TITLE = "title";
var META_ROOT_ID = "rootId";
var META_LAYOUT = "layout";
var NODE_TEXT = "text";
var NODE_NOTE = "note";
var NODE_PARENT_ID = "parentId";
var NODE_COLOR = "color";
var NODE_STATUS = "status";
var NODE_POS_X = "posX";
var NODE_POS_Y = "posY";
var NODE_CHILD_IDS = "childIds";
var NODE_TAGS = "tags";
var NODE_LINK = "link";
var NODE_PINNED = "pinned";
function getYNodes(yDoc) {
  return yDoc.getMap(Y_NODES);
}
function getYMeta(yDoc) {
  return yDoc.getMap(Y_META);
}
function createYNode(node) {
  const yNode = new YMap();
  yNode.set(NODE_TEXT, node.text);
  yNode.set(NODE_NOTE, node.note);
  yNode.set(NODE_PARENT_ID, node.parentId);
  yNode.set(NODE_COLOR, node.color);
  yNode.set(NODE_STATUS, node.status);
  yNode.set(NODE_POS_X, node.position.x);
  yNode.set(NODE_POS_Y, node.position.y);
  yNode.set(NODE_LINK, node.link);
  yNode.set(NODE_PINNED, node.pinned);
  const yChildIds = new YArray();
  if (node.childIds.length > 0) yChildIds.push(node.childIds.slice());
  yNode.set(NODE_CHILD_IDS, yChildIds);
  const yTags = new YArray();
  if (node.tags.length > 0) yTags.push(node.tags.slice());
  yNode.set(NODE_TAGS, yTags);
  return yNode;
}
function readYNode(id2, yNode) {
  const childIdsArr = yNode.get(NODE_CHILD_IDS);
  const tagsArr = yNode.get(NODE_TAGS);
  return {
    id: id2,
    text: String(yNode.get(NODE_TEXT) ?? ""),
    note: String(yNode.get(NODE_NOTE) ?? ""),
    parentId: yNode.get(NODE_PARENT_ID) ?? null,
    color: yNode.get(NODE_COLOR) ?? "default",
    status: yNode.get(NODE_STATUS) ?? "none",
    position: {
      x: Number(yNode.get(NODE_POS_X) ?? 0),
      y: Number(yNode.get(NODE_POS_Y) ?? 0)
    },
    childIds: childIdsArr ? childIdsArr.toArray() : [],
    tags: tagsArr ? tagsArr.toArray() : [],
    link: String(yNode.get(NODE_LINK) ?? ""),
    pinned: Boolean(yNode.get(NODE_PINNED) ?? false)
  };
}
function readYDoc(yDoc) {
  const yNodes = getYNodes(yDoc);
  const yMeta = getYMeta(yDoc);
  const nodes = {};
  for (const id2 of yNodes.keys()) {
    const yNode = yNodes.get(id2);
    if (yNode) nodes[id2] = readYNode(id2, yNode);
  }
  const rootId = yMeta.get(META_ROOT_ID) ?? "node_root";
  const title = yMeta.get(META_TITLE) ?? "Untitled map";
  const rawLayout = yMeta.get(META_LAYOUT);
  const layout = rawLayout === "right" ? "right" : "balanced";
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    version: 1,
    title,
    rootId,
    nodes,
    metadata: {
      layout,
      createdAt: now,
      updatedAt: now,
      canvas: { viewport: { x: 0, y: 0, zoom: 1 } }
    }
  };
}

// ../../../nimbalyst-mindmap/src/collab/seed.ts
function isMindmapYDocEmpty(yDoc) {
  return getYNodes(yDoc).size === 0;
}
function seedMindmapYDoc(yDoc, content) {
  const raw = typeof content === "string" ? content : decodeBuffer3(content);
  if (raw.trim() === "") return;
  const parsed = parseDocument(raw);
  const stable = makeIdsDeterministic(parsed);
  writeDocument(yDoc, stable);
}
function decodeBuffer3(buf) {
  try {
    return new TextDecoder().decode(buf);
  } catch {
    return "";
  }
}
function writeDocument(yDoc, doc) {
  const yNodes = getYNodes(yDoc);
  const yMeta = getYMeta(yDoc);
  yMeta.set(META_TITLE, doc.title);
  yMeta.set(META_ROOT_ID, doc.rootId);
  yMeta.set(META_LAYOUT, doc.metadata.layout);
  for (const id2 of Object.keys(doc.nodes)) {
    const node = doc.nodes[id2];
    if (!yNodes.has(id2)) {
      yNodes.set(id2, createYNode(node));
    }
  }
}
function makeIdsDeterministic(doc) {
  const remap = /* @__PURE__ */ new Map();
  remap.set(doc.rootId, "node_root");
  let counter = 0;
  const stack = [doc.rootId];
  while (stack.length > 0) {
    const oldId = stack.pop();
    const node = doc.nodes[oldId];
    if (!node) continue;
    for (let i = node.childIds.length - 1; i >= 0; i--) {
      const childOldId = node.childIds[i];
      if (!remap.has(childOldId)) {
        remap.set(childOldId, `n${++counter}`);
        stack.push(childOldId);
      }
    }
  }
  const newNodes = {};
  for (const [oldId, node] of Object.entries(doc.nodes)) {
    const newId = remap.get(oldId) ?? oldId;
    newNodes[newId] = {
      ...node,
      id: newId,
      parentId: node.parentId ? remap.get(node.parentId) ?? node.parentId : null,
      childIds: node.childIds.map((c) => remap.get(c) ?? c)
    };
  }
  return {
    ...doc,
    rootId: remap.get(doc.rootId) ?? "node_root",
    nodes: newNodes
  };
}

// ../../../nimbalyst-mindmap/src/collab/codec.ts
function decodeSource5(source) {
  if (typeof source === "string") return source;
  try {
    return new TextDecoder().decode(source);
  } catch {
    return "";
  }
}
var mindmapCodec = {
  documentType: "mindmap",
  fileExtensions: [".mindmap"],
  mimeType: "text/markdown",
  layoutVersion: 1,
  isEmpty(yDoc) {
    return isMindmapYDocEmpty(yDoc);
  },
  seedFromFile(yDoc, source) {
    seedMindmapYDoc(yDoc, decodeSource5(source));
  },
  applyFromFile(yDoc, source) {
    const text = decodeSource5(source);
    if (text.trim() === "") return;
    yDoc.transact(() => {
      getYNodes(yDoc).clear();
      getYMeta(yDoc).clear();
      seedMindmapYDoc(yDoc, text);
    });
  },
  exportToFile(yDoc) {
    return serializeDocument(readYDoc(yDoc));
  },
  toPlainText(yDoc) {
    return serializeDocument(readYDoc(yDoc));
  }
};

// ../runtime/src/canvas/canvasRank.ts
var CANVAS_NODE_RANK_FIELD = "x-nimbalyst-z";
var RANK_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var RANK_BASE = RANK_DIGITS.length;
var RANK_MAX_WIDTH = 4096;
function canvasRankBetween(lowerBound, upperBound) {
  const lower = normalizeCanvasRank(lowerBound);
  const upper = normalizeCanvasRank(upperBound);
  if (lower !== null && upper !== null && lower >= upper) {
    throw new RangeError("Canvas rank bounds must be strictly increasing");
  }
  if (upper === null) return rankAfter(lower);
  for (let width = Math.max(lower?.length ?? 0, upper.length, 1); width < RANK_MAX_WIDTH; width += 1) {
    const sum = new Array(width + 1).fill(0);
    let carry = 0;
    for (let index = width - 1; index >= 0; index -= 1) {
      const total = rankDigitAt(lower, index) + rankDigitAt(upper, index) + carry;
      sum[index + 1] = total % RANK_BASE;
      carry = total >= RANK_BASE ? 1 : 0;
    }
    sum[0] = carry;
    const half = new Array(width + 1).fill(0);
    let remainder = 0;
    for (let index = 0; index <= width; index += 1) {
      const value = remainder * RANK_BASE + sum[index];
      half[index] = Math.floor(value / 2);
      remainder = value % 2;
    }
    const candidate = normalizeCanvasRank(
      half.slice(1).map((digit) => RANK_DIGITS[digit]).join("")
    );
    if (candidate !== null && (lower === null || candidate > lower) && candidate < upper) {
      return candidate;
    }
  }
  throw new RangeError("Canvas rank space exhausted");
}
function canvasRankSequence(count) {
  if (count <= 0) return [];
  let width = 1;
  let span = RANK_BASE;
  while (span <= count && width < 8) {
    width += 1;
    span *= RANK_BASE;
  }
  return Array.from(
    { length: count },
    (_unused, index) => rankFromValue(Math.floor((index + 1) * span / (count + 1)), width)
  );
}
function compareCanvasRank(left, right) {
  if (left === right) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  return left < right ? -1 : left > right ? 1 : 0;
}
function normalizeCanvasRank(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/0+$/, "");
  if (trimmed.length === 0) return null;
  for (const character of trimmed) {
    if (!RANK_DIGITS.includes(character)) return null;
  }
  return trimmed;
}
function rankAfter(lower) {
  if (lower === null || lower.length === 0) {
    return RANK_DIGITS[Math.floor(RANK_BASE / 2)];
  }
  for (let index = lower.length - 1; index >= 0; index -= 1) {
    const digit = rankDigitAt(lower, index);
    if (digit < RANK_BASE - 1) {
      return lower.slice(0, index) + RANK_DIGITS[digit + 1];
    }
  }
  return lower + RANK_DIGITS[Math.floor(RANK_BASE / 2)];
}
function rankDigitAt(rank, index) {
  const character = rank?.[index];
  if (character === void 0) return 0;
  const digit = RANK_DIGITS.indexOf(character);
  return digit < 0 ? 0 : digit;
}
function rankFromValue(value, width) {
  let remaining = value;
  const digits = [];
  for (let index = 0; index < width; index += 1) {
    digits.unshift(RANK_DIGITS[remaining % RANK_BASE]);
    remaining = Math.floor(remaining / RANK_BASE);
  }
  return normalizeCanvasRank(digits.join("")) ?? RANK_DIGITS[1];
}

// ../runtime/src/canvas/CanvasDocument.ts
var NIMBALYST_CANVAS_NAMESPACE = "x-nimbalyst";
var CANVAS_SPEC_NODE_TYPES = [
  "text",
  "file",
  "link",
  "group"
];
function isCanvasSpecNode(node) {
  return CANVAS_SPEC_NODE_TYPES.includes(node.type);
}
function parseCanvasDocument(source) {
  const text = typeof source === "string" ? source : new TextDecoder("utf-8").decode(source);
  const value = JSON.parse(text);
  assertCanvasDocument(value);
  return value;
}
function serializeCanvasDocument(document2) {
  assertCanvasDocument(document2);
  const normalized = { ...document2 };
  if (document2.nodes !== void 0) {
    normalized.nodes = document2.nodes.map(withCanvasGeometryRounded);
  }
  if (document2.edges !== void 0) {
    normalized.edges = [...document2.edges].sort(
      (left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0
    );
  }
  return JSON.stringify(canonicalValue(normalized, DOCUMENT_SHAPE), null, 2);
}
function toCanvasCoordinate(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError("Canvas geometry must be a finite number");
  }
  return Math.round(value);
}
function withCanvasGeometryRounded(node) {
  const rounded = {};
  let changed = false;
  for (const key of CANVAS_GEOMETRY_KEYS) {
    const next = toCanvasCoordinate(node[key]);
    if (next !== node[key]) changed = true;
    rounded[key] = next;
  }
  return changed ? { ...node, ...rounded } : node;
}
var CANVAS_GEOMETRY_KEYS = ["x", "y", "width", "height"];
var VIEWPORT_SHAPE = { order: ["x", "y", "zoom"] };
var DESIGN_SYSTEM_SHAPE = {
  order: ["uri", "styleGuide", "theme"]
};
var BOARD_META_SHAPE = {
  order: ["name", "description", "viewport", "designSystem"],
  children: { viewport: VIEWPORT_SHAPE, designSystem: DESIGN_SYSTEM_SHAPE }
};
var DOCUMENT_EXTENSION_SHAPE = {
  order: ["version", "meta"],
  children: { meta: BOARD_META_SHAPE }
};
var REFERENCE_SHAPE = {
  order: [
    "kind",
    "nativeKind",
    "path",
    "uri",
    "revisionId",
    "sharedAs",
    "content"
  ],
  children: { sharedAs: { order: ["uri", "revisionId"] } }
};
var NODE_EXTENSION_SHAPE = {
  order: ["reference", "label", "locked", "group"],
  children: { reference: REFERENCE_SHAPE }
};
var EDGE_EXTENSION_SHAPE = {
  order: ["kind", "flow"],
  children: { flow: { order: ["fromElementSelector", "trigger"] } }
};
var NODE_SHAPE = {
  order: [
    "id",
    "type",
    "x",
    "y",
    "width",
    "height",
    "color",
    "text",
    "file",
    "subpath",
    "url",
    "label",
    "background",
    "backgroundStyle",
    NIMBALYST_CANVAS_NAMESPACE
  ],
  children: { [NIMBALYST_CANVAS_NAMESPACE]: NODE_EXTENSION_SHAPE }
};
var EDGE_SHAPE = {
  order: [
    "id",
    "fromNode",
    "fromSide",
    "fromEnd",
    "toNode",
    "toSide",
    "toEnd",
    "color",
    "label",
    NIMBALYST_CANVAS_NAMESPACE
  ],
  children: { [NIMBALYST_CANVAS_NAMESPACE]: EDGE_EXTENSION_SHAPE }
};
var DOCUMENT_SHAPE = {
  order: ["nodes", "edges", NIMBALYST_CANVAS_NAMESPACE],
  children: {
    nodes: { order: [], item: NODE_SHAPE },
    edges: { order: [], item: EDGE_SHAPE },
    [NIMBALYST_CANVAS_NAMESPACE]: DOCUMENT_EXTENSION_SHAPE
  }
};
function canonicalValue(value, shape) {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalValue(entry, shape?.item));
  }
  if (!isRecord(value)) return value;
  const order = shape?.order ?? [];
  const known = order.filter((key) => hasOwn(value, key));
  const rest = Object.keys(value).filter((key) => !order.includes(key)).sort();
  const result = {};
  for (const key of [...known, ...rest]) {
    result[key] = canonicalValue(value[key], shape?.children?.[key]);
  }
  return result;
}
function assertCanvasDocument(value) {
  if (!isRecord(value)) {
    throw new TypeError("Canvas document must be a JSON object");
  }
  if (value.nodes !== void 0) {
    if (!Array.isArray(value.nodes)) {
      throw new TypeError("Canvas document nodes must be an array");
    }
    const ids2 = /* @__PURE__ */ new Set();
    for (const node of value.nodes) {
      assertCanvasNode(node);
      if (ids2.has(node.id)) {
        throw new TypeError(`Canvas node id must be unique: ${node.id}`);
      }
      ids2.add(node.id);
    }
  }
  if (value.edges !== void 0) {
    if (!Array.isArray(value.edges)) {
      throw new TypeError("Canvas document edges must be an array");
    }
    const ids2 = /* @__PURE__ */ new Set();
    for (const edge of value.edges) {
      assertCanvasEdge(edge);
      if (ids2.has(edge.id)) {
        throw new TypeError(`Canvas edge id must be unique: ${edge.id}`);
      }
      ids2.add(edge.id);
    }
  }
  const extension = value[NIMBALYST_CANVAS_NAMESPACE];
  if (extension !== void 0 && !isRecord(extension)) {
    throw new TypeError(`${NIMBALYST_CANVAS_NAMESPACE} must be an object`);
  }
}
function assertCanvasNode(value) {
  if (!isRecord(value)) throw new TypeError("Canvas node must be an object");
  requireString(value, "id", "Canvas node");
  requireString(value, "type", "Canvas node");
  for (const key of CANVAS_GEOMETRY_KEYS) {
    if (typeof value[key] !== "number" || !Number.isFinite(value[key])) {
      throw new TypeError(`Canvas node ${key} must be a finite number`);
    }
  }
  switch (value.type) {
    /*
     * A native card's own payload may be empty, and only it.
     *
     * The surface creates a sticky or an image card the moment it is dropped
     * and the author fills it in afterwards, so `text: ''` and `url: ''` are
     * states a real board sits in. Refusing them made a board editable but not
     * serializable, which broke local `.canvas` save, every headless collab
     * read, and the console's source mode -- the escape hatch meant for
     * exactly the board that will not open. See NIM-5378.
     *
     * The field must still be present and a string: a `text` node with no
     * `text` at all is malformed, not half-authored. Everything else on the
     * node -- `id`, `type`, a file node's `file` -- stays strict, because an
     * empty value there names nothing.
     */
    case "text":
      requirePossiblyEmptyString(value, "text", "Canvas text node");
      break;
    case "file":
      requireString(value, "file", "Canvas file node");
      break;
    case "link":
      requirePossiblyEmptyString(value, "url", "Canvas link node");
      break;
    default:
      break;
  }
}
function assertCanvasEdge(value) {
  if (!isRecord(value)) throw new TypeError("Canvas edge must be an object");
  requireString(value, "id", "Canvas edge");
  requireString(value, "fromNode", "Canvas edge");
  requireString(value, "toNode", "Canvas edge");
  assertOptionalEnum(value, "fromSide", ["top", "right", "bottom", "left"]);
  assertOptionalEnum(value, "toSide", ["top", "right", "bottom", "left"]);
  assertOptionalEnum(value, "fromEnd", ["none", "arrow"]);
  assertOptionalEnum(value, "toEnd", ["none", "arrow"]);
}
function requireString(value, key, owner) {
  if (typeof value[key] !== "string" || value[key].length === 0) {
    throw new TypeError(`${owner} ${key} must be a non-empty string`);
  }
}
function requirePossiblyEmptyString(value, key, owner) {
  if (typeof value[key] !== "string") {
    throw new TypeError(`${owner} ${key} must be a string`);
  }
}
function assertOptionalEnum(value, key, allowed) {
  const candidate = value[key];
  if (candidate !== void 0 && !allowed.includes(candidate)) {
    throw new TypeError(`Canvas edge ${key} has an invalid value`);
  }
}
function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ../runtime/src/canvas/canvasCommentAnchors.ts
var CANVAS_NODE_ENTITY_TYPE = "canvas-node";
var CANVAS_POINT_ENTITY_TYPE = "canvas-point";
var CANVAS_ORPHANED_CARD_SUFFIX = " (deleted card)";
function isEntityAnchor(anchor) {
  return anchor !== void 0 && anchor.kind === "entity" && typeof anchor.entityId === "string" && anchor.entityId.length > 0;
}
function isCanvasNodeAnchor(anchor) {
  return isEntityAnchor(anchor) && anchor.entityType === CANVAS_NODE_ENTITY_TYPE;
}
function isCanvasPointAnchor(anchor) {
  return isEntityAnchor(anchor) && anchor.entityType === CANVAS_POINT_ENTITY_TYPE && parseCanvasPointId(anchor.entityId) !== null;
}
function isCanvasCommentAnchor(anchor) {
  return isCanvasNodeAnchor(anchor) || isCanvasPointAnchor(anchor);
}
function parseCanvasPointId(entityId) {
  const match = /^(-?\d+),(-?\d+)$/.exec(entityId);
  if (!match) return null;
  return { x: Number(match[1]), y: Number(match[2]) };
}
function canvasNodeIdFromAnchor(anchor) {
  return isCanvasNodeAnchor(anchor) ? anchor.entityId : null;
}
function canvasPointFromAnchor(anchor) {
  return isCanvasPointAnchor(anchor) ? parseCanvasPointId(anchor.entityId) : null;
}
function canvasCommentAnchorState(anchor, hasNode) {
  const nodeId = canvasNodeIdFromAnchor(anchor);
  if (nodeId !== null) return hasNode(nodeId) ? "attached" : "orphaned";
  return isCanvasPointAnchor(anchor) ? "attached" : "orphaned";
}
function describeCanvasCommentAnchor(anchor, liveLabel) {
  const point = canvasPointFromAnchor(anchor);
  if (point) return `Point ${point.x}, ${point.y}`;
  const nodeId = canvasNodeIdFromAnchor(anchor);
  if (nodeId === null) return "";
  if (liveLabel !== null) return `Card: ${liveLabel || nodeId}`;
  const snapshot = isCanvasNodeAnchor(anchor) && anchor.labelSnapshot ? anchor.labelSnapshot : nodeId;
  return `Card: ${snapshot}${CANVAS_ORPHANED_CARD_SUFFIX}`;
}

// ../runtime/src/canvas/canvasCollabCodec.ts
var CANVAS_Y_NODES = "nodes";
var CANVAS_Y_EDGES = "edges";
var CANVAS_Y_META = "meta";
var CANVAS_Y_EXTRAS = "extras";
var CANVAS_EXTRAS_TOP_LEVEL = "topLevel";
var CANVAS_EXTRAS_NAMESPACE = "namespace";
var NODE_EXTENSION_FIELDS = {
  locked: "__canvas_locked",
  group: "__canvas_group"
};
var NODE_EXTENSION_KEYS = new Set(Object.values(NODE_EXTENSION_FIELDS));
var NODE_FILE_KEY_PREFIX = "__canvas_file:";
function canvasNodeFields(node) {
  const fields = new Map(Array.from(entityFields(node), ([key, value]) => [
    NODE_EXTENSION_KEYS.has(key) || key.startsWith(NODE_FILE_KEY_PREFIX) ? NODE_FILE_KEY_PREFIX + key : key,
    value
  ]));
  const namespace = node[NIMBALYST_CANVAS_NAMESPACE];
  const rest = { ...namespace };
  for (const [name, key] of Object.entries(NODE_EXTENSION_FIELDS)) {
    const legacy = node[key];
    const compatible = name === "locked" ? typeof legacy === "boolean" : typeof legacy === "string";
    fields.set(key, namespace?.[name] ?? (compatible ? legacy : null));
    delete rest[name];
  }
  if (Object.keys(rest).length > 0) fields.set(NIMBALYST_CANVAS_NAMESPACE, rest);
  else fields.delete(NIMBALYST_CANVAS_NAMESPACE);
  return fields;
}
var NODE_RESERVED_KEYS = [CANVAS_NODE_RANK_FIELD];
var canvasCollabCodec = {
  documentType: "canvas",
  fileExtensions: [".canvas"],
  mimeType: "application/json",
  layoutVersion: 1,
  isEmpty(yDoc) {
    return getCanvasYNodes(yDoc).size === 0 && getCanvasYEdges(yDoc).size === 0 && getCanvasYMeta(yDoc).size === 0 && getCanvasYExtras(yDoc).size === 0;
  },
  seedFromFile(yDoc, source) {
    const document2 = parseCanvasDocument(decodeSource6(source));
    yDoc.transact(() => {
      seedNodes(getCanvasYNodes(yDoc), document2.nodes ?? []);
      seedEntities(getCanvasYEdges(yDoc), document2.edges ?? []);
      seedFields(getCanvasYMeta(yDoc), boardMetaFields(document2));
      seedFields(getCanvasYExtras(yDoc), extrasFields(document2));
    });
  },
  applyFromFile(yDoc, source) {
    const document2 = parseCanvasDocument(decodeSource6(source));
    const nodes = document2.nodes ?? [];
    yDoc.transact(() => {
      const yNodes = getCanvasYNodes(yDoc);
      patchEntities(yNodes, nodes, NODE_RESERVED_KEYS, true);
      reconcileNodeRanks(
        yNodes,
        nodes.map((node) => node.id)
      );
      patchEntities(getCanvasYEdges(yDoc), document2.edges ?? [], []);
      patchFields(getCanvasYMeta(yDoc), boardMetaFields(document2));
      patchFields(getCanvasYExtras(yDoc), extrasFields(document2));
    });
  },
  exportToFile(yDoc) {
    return serializeCanvasDocument(readCanvasDocumentFromYDoc(yDoc));
  },
  /**
   * Anchor resolution for headless hosts -- the MCP comment tools and the
   * notification/inbox paths, which must answer "does this thread still point
   * at anything?" without a board mounted.
   *
   * Reads only. The snapshot handed in is a detached, disposable Y.Doc, and
   * nothing below writes to it or holds a reference past the call.
   */
  commentAnchors: {
    handles(anchor) {
      return isCanvasCommentAnchor(anchor);
    },
    getState(snapshot, anchor) {
      const nodes = getCanvasYNodes(snapshot);
      return canvasCommentAnchorState(anchor, (nodeId) => nodes.has(nodeId));
    },
    describe(snapshot, anchor) {
      const nodeId = canvasNodeIdFromAnchor(anchor);
      const fields = nodeId === null ? void 0 : getCanvasYNodes(snapshot).get(nodeId);
      return describeCanvasCommentAnchor(
        anchor,
        fields === void 0 ? null : canvasNodeFieldLabel(fields)
      );
    }
  },
  toPlainText(yDoc) {
    const document2 = readCanvasDocumentFromYDoc(yDoc);
    const meta = document2[NIMBALYST_CANVAS_NAMESPACE]?.meta;
    const lines = [];
    if (typeof meta?.name === "string" && meta.name) lines.push(meta.name);
    if (typeof meta?.description === "string" && meta.description) {
      lines.push(meta.description);
    }
    for (const node of document2.nodes ?? []) {
      const label = node[NIMBALYST_CANVAS_NAMESPACE]?.label;
      if (typeof label === "string" && label) {
        lines.push(label);
        continue;
      }
      if (!isCanvasSpecNode(node)) continue;
      if (node.type === "text") lines.push(node.text);
      else if (node.type === "file") lines.push(node.file);
      else if (node.type === "link") lines.push(node.url);
      else if (node.label) lines.push(node.label);
    }
    return lines.join("\n");
  }
};
function getCanvasYNodes(yDoc) {
  return yDoc.getMap(CANVAS_Y_NODES);
}
function getCanvasYEdges(yDoc) {
  return yDoc.getMap(CANVAS_Y_EDGES);
}
function getCanvasYMeta(yDoc) {
  return yDoc.getMap(CANVAS_Y_META);
}
function getCanvasYExtras(yDoc) {
  return yDoc.getMap(CANVAS_Y_EXTRAS);
}
function decodeSource6(source) {
  return typeof source === "string" ? source : new TextDecoder("utf-8").decode(source);
}
function seedNodes(target, nodes) {
  const ranks = canvasRankSequence(nodes.length);
  nodes.forEach((node, index) => {
    if (target.has(node.id)) return;
    const fields = new YMap();
    for (const [key, value] of canvasNodeFields(node)) fields.set(key, value);
    fields.set(CANVAS_NODE_RANK_FIELD, ranks[index]);
    target.set(node.id, fields);
  });
}
function seedEntities(target, entities) {
  for (const entity of entities) {
    if (target.has(entity.id)) continue;
    const fields = new YMap();
    writeAllEntityFields(fields, entity);
    target.set(entity.id, fields);
  }
}
function patchEntities(target, entities, reservedKeys, nodes = false) {
  const incoming = new Set(entities.map((entity) => entity.id));
  for (const id2 of Array.from(target.keys())) {
    if (!incoming.has(id2)) target.delete(id2);
  }
  for (const entity of entities) {
    const current = target.get(entity.id);
    const incomingFields = nodes ? canvasNodeFields(entity) : entityFields(entity);
    if (current) {
      patchFields(current, incomingFields, reservedKeys);
    } else {
      const fields = new YMap();
      for (const [key, value] of incomingFields) fields.set(key, value);
      target.set(entity.id, fields);
    }
  }
}
function reconcileNodeRanks(target, orderedIds) {
  const ranks = orderedIds.map(
    (id2) => normalizeCanvasRank(target.get(id2)?.get(CANVAS_NODE_RANK_FIELD))
  );
  let previous = null;
  for (let index = 0; index < orderedIds.length; index += 1) {
    const rank = ranks[index];
    if (rank !== null && (previous === null || rank > previous)) {
      previous = rank;
      continue;
    }
    let next = null;
    for (let ahead = index + 1; ahead < ranks.length; ahead += 1) {
      const candidate = ranks[ahead];
      if (candidate !== null && (previous === null || candidate > previous)) {
        next = candidate;
        break;
      }
    }
    const assigned = canvasRankBetween(previous, next);
    target.get(orderedIds[index])?.set(CANVAS_NODE_RANK_FIELD, assigned);
    ranks[index] = assigned;
    previous = assigned;
  }
}
function writeAllEntityFields(target, entity) {
  for (const [key, value] of entityFields(entity)) target.set(key, value);
}
function entityFields(entity) {
  return new Map(Object.entries(entity).filter(([key]) => key !== "id"));
}
function seedFields(target, fields) {
  for (const [key, value] of fields) {
    if (!target.has(key)) target.set(key, value);
  }
}
function patchFields(target, fields, reservedKeys = []) {
  for (const key of Array.from(target.keys())) {
    if (!fields.has(key) && !reservedKeys.includes(key)) target.delete(key);
  }
  for (const [key, value] of fields) {
    if (!target.has(key) || !jsonEqual(target.get(key), value)) {
      target.set(key, value);
    }
  }
}
function boardMetaFields(document2) {
  const meta = document2[NIMBALYST_CANVAS_NAMESPACE]?.meta;
  return new Map(isRecord2(meta) ? Object.entries(meta) : []);
}
function extrasFields(document2) {
  const fields = /* @__PURE__ */ new Map();
  const topLevel = {};
  for (const [key, value] of Object.entries(document2)) {
    if (key === "nodes" || key === "edges") continue;
    if (key === NIMBALYST_CANVAS_NAMESPACE) continue;
    topLevel[key] = value;
  }
  if (Object.keys(topLevel).length > 0) {
    fields.set(CANVAS_EXTRAS_TOP_LEVEL, topLevel);
  }
  const namespace = document2[NIMBALYST_CANVAS_NAMESPACE];
  if (isRecord2(namespace)) {
    const rest = {};
    for (const [key, value] of Object.entries(namespace)) {
      if (key !== "meta") rest[key] = value;
    }
    if (Object.keys(rest).length > 0) {
      fields.set(CANVAS_EXTRAS_NAMESPACE, rest);
    }
  }
  return fields;
}
function readCanvasDocumentFromYDoc(yDoc, options = {}) {
  const extras = getCanvasYExtras(yDoc);
  const document2 = {
    ...asRecord(extras.get(CANVAS_EXTRAS_TOP_LEVEL)),
    nodes: readNodes(getCanvasYNodes(yDoc), options.includeNodeRanks === true),
    edges: readEdges(getCanvasYEdges(yDoc))
  };
  const namespace = { ...asRecord(extras.get(CANVAS_EXTRAS_NAMESPACE)) };
  const meta = readFields(getCanvasYMeta(yDoc));
  if (Object.keys(meta).length > 0) namespace.meta = meta;
  if (Object.keys(namespace).length > 0) {
    document2[NIMBALYST_CANVAS_NAMESPACE] = namespace;
  }
  return document2;
}
function readNodes(source, includeRanks) {
  const entries = [];
  source.forEach((fields, id2) => {
    const node = { id: id2 };
    let rank = null;
    fields.forEach((value, key) => {
      if (key === CANVAS_NODE_RANK_FIELD) {
        rank = normalizeCanvasRank(value);
        if (includeRanks && rank !== null) node[key] = rank;
      } else if (key.startsWith(NODE_FILE_KEY_PREFIX)) {
        node[key.slice(NODE_FILE_KEY_PREFIX.length)] = value;
      } else if (key !== "id" && !NODE_EXTENSION_KEYS.has(key)) {
        node[key] = value;
      }
    });
    const namespace = { ...asRecord(node[NIMBALYST_CANVAS_NAMESPACE]) };
    for (const [name, key] of Object.entries(NODE_EXTENSION_FIELDS)) {
      if (!fields.has(key)) continue;
      const value = fields.get(key);
      if (value === null) delete namespace[name];
      else namespace[name] = value;
    }
    if (Object.keys(namespace).length > 0) {
      node[NIMBALYST_CANVAS_NAMESPACE] = namespace;
    } else delete node[NIMBALYST_CANVAS_NAMESPACE];
    entries.push({ node, rank });
  });
  entries.sort(
    (left, right) => compareCanvasRank(left.rank, right.rank) || left.node.id.localeCompare(right.node.id)
  );
  return entries.map((entry) => entry.node);
}
function readEdges(source) {
  const edges = [];
  source.forEach((fields, id2) => {
    const edge = { id: id2 };
    fields.forEach((value, key) => {
      if (key !== "id") edge[key] = value;
    });
    edges.push(edge);
  });
  return edges.sort((left, right) => left.id.localeCompare(right.id));
}
function canvasNodeFieldLabel(fields) {
  const namespace = fields.get(NIMBALYST_CANVAS_NAMESPACE);
  if (isRecord2(namespace) && typeof namespace.label === "string") {
    if (namespace.label) return namespace.label;
  }
  for (const key of ["label", "file", "url"]) {
    const value = fields.get(key);
    if (typeof value === "string" && value) return value;
  }
  return "";
}
function readFields(source) {
  const fields = {};
  source.forEach((value, key) => {
    fields[key] = value;
  });
  return fields;
}
function asRecord(value) {
  return isRecord2(value) ? value : {};
}
function jsonEqual(left, right) {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((value, index) => jsonEqual(value, right[index]));
  }
  if (isRecord2(left) && isRecord2(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    return leftKeys.length === rightKeys.length && leftKeys.every(
      (key) => hasOwn2(right, key) && jsonEqual(left[key], right[key])
    );
  }
  return false;
}
function hasOwn2(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ../runtime/src/sync/DocumentDecisionClient.ts
var StaleDecisionReadError = class extends Error {
  constructor() {
    super("Feedback status changed while loading. Refresh again.");
  }
};
var DocumentDecisionClient = class {
  constructor(send, ready, flush) {
    this.send = send;
    this.ready = ready;
    this.flush = flush;
  }
  send;
  ready;
  flush;
  listing;
  retryWait;
  refreshTimer;
  refreshing = false;
  mutations = 0;
  refreshAgain = false;
  epoch = 0;
  connection = 0;
  sequence = 0;
  applied = 0;
  state = [];
  authority = { loaded: false };
  listeners = /* @__PURE__ */ new Set();
  pending = /* @__PURE__ */ new Map();
  getState = () => this.state;
  subscribe = (listener) => {
    this.listeners.add(listener);
    listener(this.state, this.authority);
    return () => {
      this.listeners.delete(listener);
    };
  };
  publish() {
    for (const listener of this.listeners) listener(this.state, this.authority);
  }
  clear() {
    this.epoch++;
    this.state = [];
    this.authority = { loaded: false };
    this.publish();
  }
  hasPendingMutations = () => this.mutations > 0;
  request(command) {
    if (command.operation === "list") {
      if (this.listing) return this.listing;
      const connection = this.connection;
      const listing = this.requestFreshList().catch((error) => {
        if (connection === this.connection) {
          this.refreshAgain = false;
          if (this.refreshTimer) clearTimeout(this.refreshTimer);
          this.refreshTimer = void 0;
        }
        throw error;
      }).finally(() => {
        if (this.listing === listing) this.listing = void 0;
      });
      this.listing = listing;
      return listing;
    }
    this.mutations++;
    return this.requestCommand(command).finally(() => {
      this.mutations--;
    });
  }
  async requestFreshList() {
    const connection = this.connection;
    for (let attempt = 0; attempt < 4; attempt++) {
      if (connection !== this.connection)
        throw new Error("Document disconnected while refreshing feedback.");
      if (attempt > 0) {
        const epoch2 = this.epoch;
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            this.retryWait = void 0;
            resolve();
          }, 10);
          this.retryWait = { timer, reject };
        });
        if (connection !== this.connection)
          throw new Error("Document disconnected while refreshing feedback.");
        if (epoch2 !== this.epoch) continue;
      }
      this.refreshAgain = false;
      if (this.refreshTimer) clearTimeout(this.refreshTimer);
      this.refreshTimer = void 0;
      const epoch = this.epoch;
      try {
        const request = this.requestCommand({ operation: "list" });
        const sequence2 = this.sequence;
        const result = await request;
        if (connection !== this.connection)
          throw new Error("Document disconnected while refreshing feedback.");
        if (!result.loaded) {
          this.refreshAgain = false;
          if (this.refreshTimer) clearTimeout(this.refreshTimer);
          this.refreshTimer = void 0;
          return result;
        }
        if (epoch !== this.epoch || sequence2 < this.applied)
          throw new StaleDecisionReadError();
        return result;
      } catch (error) {
        if (!(error instanceof StaleDecisionReadError)) throw error;
      }
    }
    throw new StaleDecisionReadError();
  }
  async requestCommand(command) {
    const connection = this.connection;
    try {
      if (!this.ready())
        throw new Error(
          "Wait for this document to connect before sending feedback."
        );
      if (command.operation !== "list" && !await this.flush())
        throw new Error(
          "The document has not been saved to the server. Retry after it reconnects."
        );
      if (connection !== this.connection || !this.ready())
        throw new Error("Document disconnected before the request was sent.");
    } catch (error) {
      if (connection === this.connection) this.clear();
      throw error;
    }
    const requestId = crypto.randomUUID();
    const epoch = this.epoch;
    const sequence2 = ++this.sequence;
    return new Promise((resolve, reject) => {
      const fail = (error) => {
        this.pending.delete(requestId);
        if (epoch === this.epoch && sequence2 >= this.applied) this.clear();
        reject(error);
      };
      const timer = setTimeout(
        () => fail(
          new Error(
            "Feedback delivery could not be confirmed. Reconnect and retry; the same block will not be sent twice."
          )
        ),
        15e3
      );
      this.pending.set(requestId, {
        resolve,
        reject,
        timer,
        epoch,
        sequence: sequence2,
        operation: command.operation
      });
      try {
        this.send({ type: "docDecisionCommand", requestId, command });
      } catch (error) {
        clearTimeout(timer);
        fail(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
  receive(message) {
    const pending = message.requestId ? this.pending.get(message.requestId) : void 0;
    if (!pending) return;
    clearTimeout(pending.timer);
    this.pending.delete(message.requestId);
    if (pending.epoch !== this.epoch || pending.sequence < this.applied) {
      if (message.error) pending.reject(new Error(message.error));
      else if (pending.operation === "list" && message.privacyVersion === 1)
        pending.reject(new StaleDecisionReadError());
      else pending.resolve({ decisions: [], loaded: false });
      return;
    }
    this.applied = pending.sequence;
    if (message.error) {
      this.clear();
      pending.reject(new Error(message.error));
      return;
    }
    const supported = message.privacyVersion === 1;
    const loaded = supported && (pending.operation === "list" || this.authority.loaded);
    this.authority = {
      loaded,
      ...supported ? { privacyVersion: 1 } : {}
    };
    this.state = loaded ? message.decisions : [];
    this.publish();
    pending.resolve({ decisions: this.state, ...this.authority });
  }
  refreshSubscribers() {
    if (this.listeners.size) this.invalidate();
  }
  /** Clear synchronously; fetch only each connection's authorized projection. */
  invalidate() {
    this.clear();
    this.refreshAgain = true;
    this.scheduleRefresh();
  }
  scheduleRefresh() {
    if (this.refreshTimer || this.refreshing || !this.ready()) return;
    this.refreshTimer = setTimeout(() => {
      this.refreshTimer = void 0;
      this.refreshAgain = false;
      this.refreshing = true;
      const connection = this.connection;
      void this.request({ operation: "list" }).catch(() => {
        if (connection === this.connection) this.refreshAgain = false;
      }).finally(() => {
        if (connection !== this.connection) return;
        this.refreshing = false;
        if (this.refreshAgain) this.scheduleRefresh();
      });
    }, 10);
  }
  disconnect() {
    this.connection++;
    this.listing = void 0;
    if (this.retryWait) {
      clearTimeout(this.retryWait.timer);
      this.retryWait.reject(
        new Error("Document disconnected while refreshing feedback.")
      );
      this.retryWait = void 0;
    }
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = void 0;
    this.refreshing = false;
    this.refreshAgain = false;
    this.clear();
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(
        new Error(
          "Document disconnected before feedback delivery was confirmed."
        )
      );
    }
    this.pending.clear();
  }
};

// ../runtime/src/sync/documentSyncTypes.ts
function documentSyncMemberId(config) {
  return config.teamMemberId ?? config.personalMemberId;
}

// ../collab-protocol/dist/syncClientInfo.js
var MAX_LABEL_LENGTH = 32;
var clientInfo = {
  platform: "unknown",
  version: "unknown"
};
function appendSyncClientParams(urlWithToken) {
  const platform = encodeURIComponent(clientInfo.platform.slice(0, MAX_LABEL_LENGTH));
  const version = encodeURIComponent(clientInfo.version.slice(0, MAX_LABEL_LENGTH));
  return `${urlWithToken}&platform=${platform}&version=${version}`;
}
function redactSyncUrl(url) {
  if (!url)
    return void 0;
  return url.replace(/([?&]token=)[^&]*/g, "$1<redacted>");
}

// ../runtime/src/sync/collabDocumentId.ts
var COLLAB_DOCUMENT_ID_PATTERN = /^[A-Za-z0-9_-]+$/;
function isValidCollabDocumentId(documentId) {
  return typeof documentId === "string" && documentId.length > 0 && COLLAB_DOCUMENT_ID_PATTERN.test(documentId);
}
function encodeDocumentRoomId(orgId, documentId) {
  return `org:${orgId}:doc:${encodeURIComponent(documentId)}`;
}

// ../runtime/src/sync/OutboxDrainer.ts
var OUTBOX_RETRY_MAX_MS = 30 * 6e4;
var CONFIRMED_REVOCATION_CODES = /* @__PURE__ */ new Set([
  "forbidden",
  "membership_revoked",
  "authorization_revoked",
  "access_revoked",
  "not_a_member",
  "document_access_revoked",
  // A role that permits reading but not editing is a settled answer, not a
  // transient one: retrying replays the same refused update on every
  // reconnect, forever, instead of telling the user the document is read-only.
  "document_read_only"
]);
function isConfirmedOutboxRevocationCode(errorCode) {
  return CONFIRMED_REVOCATION_CODES.has(errorCode);
}

// ../runtime/src/sync/collabConnectionDiagnostics.ts
var PREFIX = "[CollabConnection]";
var ids = /* @__PURE__ */ new WeakMap();
var contexts = /* @__PURE__ */ new WeakMap();
var nextInstanceId = 1;
var sequence = 1;
var COLLAB_CONNECTION_DIAGNOSTICS_COMPILED = false;
function isEnabled() {
  return COLLAB_CONNECTION_DIAGNOSTICS_COMPILED && globalThis.__NIMBALYST_COLLAB_CONNECTION_DIAGNOSTICS__ === true;
}
function prefixFor(layer) {
  switch (layer) {
    case "BodyDocCache":
      return "body";
    case "DocumentReplicaCache":
      return "replica";
    case "DocumentSyncProvider":
      return "sync";
    case "CollabLexicalProvider":
      return "lexical";
    case "YDoc":
      return "ydoc";
  }
}
function getCollabConnectionInstanceId(owner, layer) {
  let id2 = ids.get(owner);
  if (!id2) {
    id2 = `${prefixFor(layer)}-${nextInstanceId++}`;
    ids.set(owner, id2);
  }
  return id2;
}
function setCollabConnectionDiagnosticContext(owner, context) {
  if (!COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) return;
  contexts.set(owner, { ...contexts.get(owner), ...context });
}
function emitCollabConnectionEvent(owner, layer, event, details = {}) {
  if (!isEnabled()) return;
  console.debug(PREFIX, JSON.stringify({
    sequence: sequence++,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    layer,
    event,
    instanceId: getCollabConnectionInstanceId(owner, layer),
    ...contexts.get(owner),
    ...details
  }));
}

// ../runtime/src/sync/documentSyncBase64.ts
var CHUNK_SIZE = 8192;
function uint8ArrayToBase64(bytes) {
  if (bytes.length < 1024) {
    return btoa(String.fromCharCode(...bytes));
  }
  let result = "";
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, bytes.length));
    result += String.fromCharCode(...chunk);
  }
  return btoa(result);
}
function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ../runtime/src/sync/DocumentSync.ts
var REMOTE_ORIGIN = "remote";
var SNAPSHOT_ORIGIN = "snapshot";
var PERSISTED_PENDING_ORIGIN = "persistedPending";
var AWARENESS_THROTTLE_MS = 500;
var AWARENESS_STALE_TIMEOUT_MS = 3e4;
var COMPACTION_UPDATE_THRESHOLD = 200;
var COMPACTION_TIME_THRESHOLD_MS = 5 * 60 * 1e3;
var COMPACTION_TIME_MIN_UPDATES = 20;
var COMPACTION_CHECK_INTERVAL_MS = 60 * 1e3;
var DocumentSyncProvider = class _DocumentSyncProvider {
  ydoc;
  ownsYDoc;
  ws = null;
  config;
  memberId;
  status = "disconnected";
  lastSeq = 0;
  lastSyncRequestSeq = 0;
  serverCapability = "unknown";
  cursorLagRecordedForConnection = false;
  synced = false;
  // Last-writer attribution from the server (who/when last edited the content).
  // Populated from docSyncResponse; used by the overwrite confirm before a push.
  lastWriterUserId = null;
  lastUpdatedAt = null;
  updateObserverDispose = null;
  awarenessStates = /* @__PURE__ */ new Map();
  awarenessTimestamps = /* @__PURE__ */ new Map();
  awarenessListeners = /* @__PURE__ */ new Set();
  statusListeners = /* @__PURE__ */ new Set();
  destroyed = false;
  // Throttled awareness state
  pendingAwareness = null;
  awarenessThrottleTimer = null;
  lastAwarenessSendTime = 0;
  awarenessCleanupTimer = null;
  // Reconnect state
  reconnectAttempt = 0;
  reconnectTimer = null;
  suppressReconnect = false;
  /**
   * NIM-949: set when the server rejected the ws upgrade with an auth-style
   * status (proxy forwards a close reason of `auth-rejected:<status>`). The next
   * connect() then requests a freshly-exchanged JWT instead of replaying the
   * cached (wrong-org / expired) token that just got rejected.
   */
  forceJwtRefreshNextConnect = false;
  /**
   * Upgrade-rejection status from the most recent close, or null if the last
   * close wasn't an auth rejection.
   *
   * Lets a caller that connects for one bounded operation (the headless seed)
   * distinguish "the server refused this room" from "still connecting" instead
   * of polling `getStatus()` until its timeout expires. A 404 here means the
   * document id is not in the org's index yet (NIM-2472).
   */
  lastAuthRejectionStatus = null;
  queuedPendingUpdate = null;
  inflightPendingUpdate = null;
  pendingPersistTimer = null;
  replayAckTimer = null;
  replayingClientUpdateId = null;
  replayingReplicaOutboxIds = [];
  replayStartedAt = null;
  replayAttemptCount = 0;
  surfaceReplayStatus = false;
  pendingWriteWaiters = /* @__PURE__ */ new Set();
  static RECONNECT_BASE_MS = 1e3;
  static RECONNECT_MAX_MS = 3e4;
  static REPLAY_ACK_TIMEOUT_MS = 1e4;
  // Compaction state
  /**
   * Server sequence covered by the latest snapshot we know about. Updated
   * when (a) we apply a server snapshot during sync, and (b) the server
   * acknowledges our own `docCompact`. Used to compute how many updates have
   * accumulated.
   */
  lastSnapshotSeq = 0;
  pendingCompactionId = null;
  compactionAckTimer = null;
  static COMPACTION_ACK_TIMEOUT_MS = 1e4;
  /**
   * Resolver for an in-flight `forceReplaceServerState` awaiting its
   * `docCompactAck`. Distinct from routine compaction (which is fire-and-forget)
   * because the recovery caller must know whether the server accepted the
   * replacement snapshot.
   */
  forceReplaceWaiter = null;
  forceReplaceCounter = 0;
  /**
   * True once ANY snapshot/update/broadcast failed to decode and was skipped
   * (the NIM-878 tolerant-skip). `lastSeq` still advances past skipped rows, so
   * this doc is missing server content it can never re-fetch on this provider
   * (resync resumes from `lastSeq`). While set, this client must NEVER win
   * compaction: a `docCompact` of an incomplete doc buries the unread rows
   * behind `replacesUpTo` for every client and prune later deletes them
   * (NIM-1519). Deliberately never reset for the provider's lifetime.
   *
   * The trigger is "content we do not hold", NOT "something threw while
   * applying". A Y.Doc listener that throws AFTER `Y.applyUpdate` integrated
   * the update (an editor binding hitting an unregistered node type, say) does
   * not set this flag: yjs commits the transaction and then calls observers via
   * `lib0/function.callAll`, which runs every listener and rethrows at the end,
   * so the CRDT already holds the full update. Vetoing compaction there would
   * degrade a whole room's sync on the strength of a client-side rendering bug.
   * See `applyDecodedUpdate` for how the two are told apart.
   */
  skippedUndecodablePayload = false;
  lastCompactionAttemptAt = 0;
  compactionTimer = null;
  constructor(config) {
    this.config = config;
    this.memberId = documentSyncMemberId(config);
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      setCollabConnectionDiagnosticContext(this, {
        documentId: config.documentId,
        shared: false
      });
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "construct", {
        orgId: config.orgId,
        hasReplica: Boolean(config.replica),
        ownsConfiguredYDoc: !config.replica && !config.ydoc
      });
    }
    this.ydoc = config.replica?.getYDoc() ?? config.ydoc ?? new Doc();
    this.ownsYDoc = !config.replica && !config.ydoc;
    this.setupUpdateObserver();
    if (config.initialPendingUpdateBase64) {
      try {
        this.queuedPendingUpdate = base64ToUint8Array(config.initialPendingUpdateBase64);
        applyUpdate(
          this.ydoc,
          this.queuedPendingUpdate,
          PERSISTED_PENDING_ORIGIN
        );
        this.setStatus("offline-unsynced");
      } catch (err) {
        console.error("[DocumentSync] Failed to restore pending local update:", err);
        this.queuedPendingUpdate = null;
      }
    }
    if (config.replica) {
      void config.replica.whenReady.then(() => {
        if (this.destroyed) return;
        const durablePending = config.replica?.getPendingOutboxUpdate();
        if (durablePending) {
          this.queuedPendingUpdate = this.queuedPendingUpdate ? mergeUpdates([this.queuedPendingUpdate, durablePending]) : durablePending;
          this.setStatus("offline-unsynced");
        }
      });
    }
  }
  // --------------------------------------------------------------------------
  // Lifecycle
  // --------------------------------------------------------------------------
  /**
   * Connect to the DocumentRoom and begin syncing.
   */
  connecting = false;
  async connect() {
    if (this.destroyed) {
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "connect-skipped", {
          reason: "destroyed"
        });
      }
      return;
    }
    if (this.ws || this.connecting) {
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "connect-skipped", {
          reason: this.ws ? "socket-present" : "already-connecting"
        });
      }
      return;
    }
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "connect", {
        reconnectAttempt: this.reconnectAttempt
      });
    }
    this.suppressReconnect = false;
    this.connecting = true;
    this.setStatus("connecting");
    if (this.config.replica) {
      await this.config.replica.whenReady;
      if (this.destroyed) {
        this.connecting = false;
        return;
      }
      if (this.config.replica.needsCleanServerHydration()) {
        try {
          await this.config.replica.beginCleanServerHydration();
          this.skippedUndecodablePayload = false;
        } catch (error) {
          console.warn("[DocumentSync] Failed to prepare damaged replica for clean hydration:", error);
        }
      }
      this.lastSeq = this.config.replica.getLastServerSeq();
      this.queuedPendingUpdate = this.config.replica.getPendingOutboxUpdate() ?? this.queuedPendingUpdate;
    }
    const { serverUrl, orgId, documentId } = this.config;
    if (!isValidCollabDocumentId(documentId)) {
      console.warn(
        `[DocumentSync] documentId ${JSON.stringify(documentId)} is not a plain URL-safe id (likely a legacy filename); connecting with it URL-encoded.`
      );
    }
    const roomId = encodeDocumentRoomId(orgId, documentId);
    let url;
    try {
      if (this.config.buildUrl) {
        url = this.config.buildUrl(roomId);
      } else {
        const forceRefresh = this.forceJwtRefreshNextConnect;
        this.forceJwtRefreshNextConnect = false;
        const jwt = await this.config.getJwt(forceRefresh ? { forceRefresh: true } : void 0);
        url = appendSyncClientParams(`${serverUrl}/sync/${roomId}?token=${encodeURIComponent(jwt)}`);
      }
    } catch (err) {
      console.error("[DocumentSync] Failed to build URL:", err);
      this.connecting = false;
      this.setStatus(this.hasPendingLocalUpdates() ? "offline-unsynced" : "disconnected");
      this.scheduleReconnect();
      return;
    }
    if (this.destroyed || this.ws) {
      this.connecting = false;
      return;
    }
    console.log("[DocumentSync] Connecting to:", redactSyncUrl(url));
    const ws = this.config.createWebSocket ? this.config.createWebSocket(url) : new WebSocket(url);
    this.ws = ws;
    this.connecting = false;
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "socket-create", {
        reconnectAttempt: this.reconnectAttempt
      });
    }
    ws.addEventListener("open", () => {
      if (this.ws !== ws) return;
      console.log("[DocumentSync] WebSocket open");
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "socket-open", {
          reconnectAttempt: this.reconnectAttempt
        });
      }
      this.suppressReconnect = false;
      this.reconnectAttempt = 0;
      this.setStatus("syncing");
      this.startAwarenessCleanup();
      this.requestSync();
    });
    ws.addEventListener("message", (event) => {
      if (this.ws !== ws) return;
      this.handleMessage(event);
    });
    ws.addEventListener("close", (event) => {
      if (this.ws !== ws) return;
      console.log("[DocumentSync] WebSocket closed, code:", event.code, "reason:", event.reason);
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "socket-close", {
          code: event.code,
          reason: event.reason
        });
      }
      if (typeof event.reason === "string" && event.reason.startsWith("auth-rejected")) {
        this.forceJwtRefreshNextConnect = true;
        const status = Number.parseInt(event.reason.split(":")[1] ?? "", 10);
        this.lastAuthRejectionStatus = Number.isFinite(status) ? status : 0;
      }
      this.handleDisconnect();
    });
    ws.addEventListener("error", (event) => {
      if (this.ws !== ws) return;
      console.error("[DocumentSync] WebSocket error:", event);
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "socket-error");
      }
      this.handleDisconnect();
    });
  }
  /**
   * Disconnect from the DocumentRoom.
   */
  disconnect() {
    this.decisionClient.disconnect();
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "disconnect", {
        hadSocket: Boolean(this.ws),
        wasConnecting: this.connecting
      });
    }
    this.cancelReconnect();
    this.clearReplayAckTimer();
    this.clearCompactionAckTimer();
    this.pendingCompactionId = null;
    if (this.forceReplaceWaiter) {
      const waiter = this.forceReplaceWaiter;
      this.forceReplaceWaiter = null;
      waiter.resolve(false);
    }
    this.connecting = false;
    this.suppressReconnect = true;
    this.requeueInflightPendingUpdate();
    this.stopAwarenessCleanup();
    this.clearAwarenessThrottle();
    this.stopCompactionTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.synced = false;
    this.setStatus(
      this.hasPendingLocalUpdates() ? "offline-unsynced" : "disconnected"
    );
  }
  /** Destroy this network attachment. Externally supplied Y.Docs survive. */
  destroy() {
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "destroy", {
        status: this.status
      });
    }
    this.destroyed = true;
    this.disconnect();
    this.teardownUpdateObserver();
    this.flushPendingPersistImmediately();
    if (this.ownsYDoc) this.ydoc.destroy();
    this.awarenessListeners.clear();
    this.awarenessStates.clear();
    this.statusListeners.clear();
  }
  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------
  /** Get the Y.Doc managed by this provider. */
  getYDoc() {
    return this.ydoc;
  }
  /**
   * The room-authenticated member id of whoever last applied a content update, or null if
   * the doc has no updates yet / the server hasn't reported it. Populated from
   * the server's docSyncResponse. Reflects the last *content* edit.
   */
  getLastWriterUserId() {
    return this.lastWriterUserId;
  }
  /** When the last content update was applied (server clock, ms), or null. */
  getLastUpdatedAt() {
    return this.lastUpdatedAt;
  }
  /** Check if connected and synced. */
  isConnected() {
    return this.status === "connected";
  }
  /** Check if initial sync is complete. */
  isSynced() {
    return this.synced;
  }
  /** Get current connection status. */
  getStatus() {
    return this.status;
  }
  /**
   * HTTP status of the most recent upgrade rejection, or null when the last
   * close wasn't one. 404 means the server does not consider this document to
   * exist for this user -- for a freshly created document, that its index row
   * has not landed yet (NIM-2472).
   */
  getLastAuthRejectionStatus() {
    return this.lastAuthRejectionStatus;
  }
  /** Get the last known server sequence number. */
  getLastSeq() {
    return this.lastSeq;
  }
  /**
   * True when any snapshot/update/broadcast was skipped as undecodable this
   * provider's lifetime. While true, the Y.Doc looking "empty" does NOT mean
   * the room is empty — server content exists that this client cannot read.
   * Hosts must gate first-open seeding on this (seeding a default document
   * over unreadable-but-real content clobbers it for every client) and this
   * provider will never compact (NIM-1519).
   */
  hasUndecodedContent() {
    return this.skippedUndecodablePayload;
  }
  /**
   * Wait until all local writes have either been acknowledged or timed out.
   * Returns false when the timeout elapses first.
   */
  async waitForPendingWrites(timeoutMs = 5e3) {
    if (!this.hasUnsettledPendingWrites()) {
      return true;
    }
    return new Promise((resolve) => {
      let settled = false;
      const cleanup = () => {
        this.pendingWriteWaiters.delete(waiter);
        clearTimeout(timeout);
      };
      const waiter = () => {
        if (settled || this.hasUnsettledPendingWrites()) return;
        settled = true;
        cleanup();
        resolve(true);
      };
      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(false);
      }, timeoutMs);
      this.pendingWriteWaiters.add(waiter);
      waiter();
    });
  }
  /** Synchronous close guard; only a server acknowledgement clears unsettled writes. */
  hasPendingWrites() {
    return this.hasUnsettledPendingWrites() || this.decisionClient.hasPendingMutations();
  }
  /**
   * Set room-level metadata on the server (e.g., custom TTL).
   * Only allowlisted keys are accepted server-side.
   */
  setRoomMetadata(entries) {
    this.send({ type: "docSetMetadata", entries });
  }
  /**
   * Encode bytes for the wire: pass-through (base64 raw bytes, empty-string iv
   * sentinel). The server encrypts at rest with the team DEK; the client holds
   * no team key.
   */
  async encodeForWire(data) {
    return { encrypted: uint8ArrayToBase64(data), iv: "" };
  }
  /**
   * Decode bytes from the wire.
   *
   * The server decrypts rows it owns and sends them as PLAINTEXT with the
   * empty-iv sentinel (''). A NON-EMPTY iv means the row is pre-cutover
   * ciphertext from the retired client-managed lane: no supported client holds
   * the key for it, so throw rather than hand Yjs bytes that decode to garbage.
   * The per-payload catch skips just that row instead of blanking the document.
   */
  async decodeFromWire(encrypted, iv) {
    if (iv) {
      throw new Error(
        "Document row is pre-cutover client-encrypted content and can no longer be read"
      );
    }
    return base64ToUint8Array(encrypted);
  }
  sendAwarenessImmediately(state) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    const jsonBytes = new TextEncoder().encode(JSON.stringify(state));
    this.send({
      type: "docAwareness",
      encryptedState: uint8ArrayToBase64(jsonBytes),
      iv: ""
    });
    return true;
  }
  /**
   * Send awareness state to other connected clients. Awareness is plaintext
   * over TLS now that team custody is server-managed; the empty-iv sentinel
   * keeps the wire shape unchanged.
   * Sends immediately (no throttling). Use setLocalAwareness() for throttled updates.
   */
  async sendAwareness(state) {
    this.sendAwarenessImmediately(state);
  }
  /**
   * Synchronously put an additive departure marker on the open socket.
   *
   * This deliberately bypasses both the 500ms awareness throttle and the
   * async encodeForWire seam: awareness is already plaintext-over-TLS with
   * an empty IV. Teardown can therefore send this frame before closing the
   * socket, including from pagehide where awaiting is unreliable.
   */
  sendAwarenessDeparture(user) {
    this.clearAwarenessThrottle();
    return this.sendAwarenessImmediately({
      user: { ...user },
      nimbalystDeparture: { version: 1 }
    });
  }
  /**
   * Set local awareness state with throttling (~2Hz).
   * Coalesces rapid updates (e.g., cursor movements while typing) and sends
   * at most once per AWARENESS_THROTTLE_MS.
   */
  setLocalAwareness(state) {
    this.pendingAwareness = state;
    const now = Date.now();
    const elapsed = now - this.lastAwarenessSendTime;
    if (elapsed >= AWARENESS_THROTTLE_MS) {
      this.flushAwareness();
    } else if (!this.awarenessThrottleTimer) {
      const delay = AWARENESS_THROTTLE_MS - elapsed;
      this.awarenessThrottleTimer = setTimeout(() => {
        this.awarenessThrottleTimer = null;
        this.flushAwareness();
      }, delay);
    }
  }
  flushAwareness() {
    if (!this.pendingAwareness) return;
    const state = this.pendingAwareness;
    this.pendingAwareness = null;
    this.lastAwarenessSendTime = Date.now();
    this.sendAwareness(state);
  }
  clearAwarenessThrottle() {
    if (this.awarenessThrottleTimer) {
      clearTimeout(this.awarenessThrottleTimer);
      this.awarenessThrottleTimer = null;
    }
    this.pendingAwareness = null;
  }
  /**
   * Subscribe to awareness state changes from remote users.
   * Returns an unsubscribe function.
   */
  onAwarenessChange(callback) {
    this.awarenessListeners.add(callback);
    return () => this.awarenessListeners.delete(callback);
  }
  /**
   * Get current awareness states for all remote users.
   */
  getAwarenessStates() {
    return new Map(this.awarenessStates);
  }
  /**
   * Subscribe to transport status changes. Returns an unsubscribe function.
   *
   * `DocumentSyncConfig.onStatusChange` is a single slot owned by whichever
   * host constructed the provider. This is the multi-listener seam for things
   * that attach to an already-built provider -- the extension awareness bridge
   * needs it to re-announce presence when a reconnect completes.
   */
  onStatusChange(listener) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }
  /**
   * Force the provider to treat the current Y.Doc as local state that should
   * be persisted upstream.
   *
   * Used by custom-editor collaboration bootstrap after a first-open seed from
   * in-memory share payloads. This avoids depending on observer/replay timing
   * when the seed happens after the initial empty sync completes.
   *
   * @deprecated Fire-and-forget: this resolves after the socket write, NOT
   * after the server confirms persistence, so a teardown immediately after can
   * lose the seed (the mindmap seed data-loss race). Prefer {@link flushWithAck},
   * which awaits a server-persisted `docUpdateAck`.
   */
  async flushLocalState() {
    const update = encodeStateAsUpdate(this.ydoc);
    if (update.length <= 2) return;
    this.enqueuePendingLocalUpdate(update);
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.synced) {
      await this.replayPendingUpdate();
    }
  }
  /**
   * Flush the current Y.Doc state upstream and resolve ONLY after the server
   * acknowledges persistence (`docUpdateAck`), not merely after the socket
   * write. This is the durability guarantee for first-open seeds and headless
   * re-uploads: content the user sees locally must reach the server before the
   * provider tears down.
   *
   * Returns `true` when the server ack'd within `timeoutMs`, `false` on timeout
   * or when not connected/synced — the caller decides whether to warn / retry
   * rather than silently discarding the seed. An empty doc (encoded state
   * <= 2 bytes) resolves `true` immediately (nothing to persist).
   *
   * The server-ack semantics come from `waitForPendingWrites`, which settles
   * only once the inflight `docUpdate` is cleared by a matching `docUpdateAck`
   * (the DocumentRoom persists synchronously to DO storage before acking).
   */
  async flushWithAck(timeoutMs = 5e3) {
    const update = encodeStateAsUpdate(this.ydoc);
    if (update.length <= 2) return true;
    this.enqueuePendingLocalUpdate(update);
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.synced) {
      await this.replayPendingUpdate();
    }
    return this.waitForPendingWrites(timeoutMs);
  }
  // --------------------------------------------------------------------------
  // Sync Protocol
  // --------------------------------------------------------------------------
  decisionClient = new DocumentDecisionClient(
    (message) => this.send(message),
    () => this.isSynced(),
    () => this.flushWithAck(8e3)
  );
  requestDecision(command) {
    return this.decisionClient.request(command);
  }
  getDecisionState = () => this.decisionClient.getState();
  onDecisionState = (listener) => this.decisionClient.subscribe(listener);
  requestSync() {
    this.lastSyncRequestSeq = this.lastSeq;
    this.send({ type: "docSyncRequest", sinceSeq: this.lastSeq });
  }
  async handleMessage(event) {
    try {
      const data = typeof event.data === "string" ? event.data : new TextDecoder().decode(event.data);
      const msg = JSON.parse(data);
      switch (msg.type) {
        case "docDecisionChanged":
          this.decisionClient.invalidate();
          break;
        case "docDecisionState":
          this.decisionClient.receive(msg);
          break;
        case "docSyncResponse":
          await this.handleSyncResponse(msg);
          if (!msg.hasMore) this.decisionClient.refreshSubscribers();
          break;
        case "docUpdateBroadcast":
          await this.handleUpdateBroadcast(msg);
          break;
        case "docUpdateAck":
          await this.handleUpdateAck(msg);
          break;
        case "docCompactAck":
          this.handleCompactionAck(msg);
          break;
        case "docAwarenessBroadcast":
          await this.handleAwarenessBroadcast(msg);
          break;
        case "docRoomMoved":
          this.disconnect();
          this.config.onRoomMoved?.({ destOrgId: msg.destOrgId });
          break;
        case "error":
          console.error("[DocumentSync] Server error:", msg.code, msg.message);
          await this.handleWriteRejection(msg.code, msg.clientUpdateId);
          break;
      }
    } catch (err) {
      console.error("[DocumentSync] Error handling message:", err);
      if (err instanceof DOMException && err.name === "OperationError") {
        console.warn("[DocumentSync] Uncaught OperationError at handleMessage scope -- dropping message.");
        return;
      }
    }
  }
  /**
   * Apply already-decrypted bytes to the Y.Doc, separating the two very
   * different ways `Y.applyUpdate` can throw:
   *
   *  - `integrated: false` -- the bytes could not be read/integrated. The
   *    payload is bad and the Y.Doc may hold only part of it.
   *  - `integrated: true` -- the update was fully integrated into the CRDT and
   *    then a Y.Doc *listener* threw (e.g. an editor binding hitting an
   *    unregistered node type). The document content is complete; the failure
   *    is downstream of sync.
   *
   * The discriminator is exact rather than heuristic. `Y.applyUpdate` opens its
   * own transaction; nesting it inside one of ours makes the inner call a no-op
   * nest (yjs reuses the open transaction), so observers fire only when the
   * OUTER transaction unwinds. `integrated` is therefore set if and only if
   * `readUpdate` completed, before any observer has run. `local: false` matches
   * what `applyUpdate` sets on the transaction itself.
   */
  applyDecodedUpdate(bytes, origin) {
    let integrated = false;
    try {
      transact(
        this.ydoc,
        () => {
          applyUpdate(this.ydoc, bytes, origin);
          integrated = true;
        },
        origin,
        false
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, integrated, error };
    }
  }
  /** Matches the shape the existing skip logs pass as their second argument. */
  static logDetail(err) {
    return err instanceof Error ? err.message : err;
  }
  async handleSyncResponse(msg) {
    const hasExplicitHead = typeof msg.serverHead === "number" && typeof msg.serverHasState === "boolean";
    if (hasExplicitHead) {
      this.serverCapability = "explicit-head";
      if (!this.cursorLagRecordedForConnection) {
        this.cursorLagRecordedForConnection = true;
        this.config.onOfflineMetric?.({
          metric: "cursor_lag_at_reconnect",
          cursorLag: Math.max(0, msg.serverHead - this.lastSyncRequestSeq)
        });
      }
    } else if (this.serverCapability !== "legacy") {
      this.serverCapability = "legacy";
      if (this.lastSyncRequestSeq !== 0) {
        this.lastSeq = 0;
        this.requestSync();
        return;
      }
    }
    if (msg.lastWriterUserId !== void 0) {
      this.lastWriterUserId = msg.lastWriterUserId;
    }
    if (msg.lastUpdatedAt !== void 0) {
      this.lastUpdatedAt = msg.lastUpdatedAt;
    }
    const replicaUpdates = [];
    let decodedCompleteBatch = true;
    if (msg.snapshot) {
      let stateBytes = null;
      try {
        stateBytes = await this.decodeFromWire(
          msg.snapshot.encryptedState,
          msg.snapshot.iv
        );
      } catch (err) {
        console.warn("[DocumentSync] Skipping undecodable snapshot; sync will continue:", _DocumentSyncProvider.logDetail(err));
        this.skippedUndecodablePayload = true;
        decodedCompleteBatch = false;
      }
      if (stateBytes !== null) {
        if (this.config.replica) {
          replicaUpdates.push({
            update: stateBytes,
            source: "server-snapshot",
            // Snapshots cover a sequence but are not themselves an update at
            // that sequence. Keeping this null avoids collision-drops against
            // an already persisted broadcast row.
            serverSequence: null
          });
        } else {
          const outcome = this.applyDecodedUpdate(stateBytes, SNAPSHOT_ORIGIN);
          if (!outcome.ok && !outcome.integrated) {
            console.warn("[DocumentSync] Skipping snapshot that decrypted but could not be integrated; sync will continue:", _DocumentSyncProvider.logDetail(outcome.error));
            this.skippedUndecodablePayload = true;
            decodedCompleteBatch = false;
          } else if (!outcome.ok) {
            console.error("[DocumentSync] Snapshot applied, but a Y.Doc listener threw while handling it (editor/binding failure, not a bad payload):", outcome.error);
            this.config.onEditorBindingError?.(outcome.error);
          }
        }
      }
      this.lastSeq = Math.max(this.lastSeq, msg.snapshot.replacesUpTo);
      this.lastSnapshotSeq = Math.max(this.lastSnapshotSeq, msg.snapshot.replacesUpTo);
    }
    for (const update of msg.updates) {
      let updateBytes = null;
      try {
        updateBytes = await this.decodeFromWire(
          update.encryptedUpdate,
          update.iv
        );
      } catch (err) {
        console.warn(`[DocumentSync] Skipping undecodable update at seq ${update.sequence}:`, _DocumentSyncProvider.logDetail(err));
        this.skippedUndecodablePayload = true;
        decodedCompleteBatch = false;
      }
      if (updateBytes !== null) {
        if (this.config.replica) {
          replicaUpdates.push({
            update: updateBytes,
            source: "remote",
            serverSequence: update.sequence
          });
        } else {
          const outcome = this.applyDecodedUpdate(updateBytes, REMOTE_ORIGIN);
          if (!outcome.ok && !outcome.integrated) {
            console.warn(`[DocumentSync] Skipping update at seq ${update.sequence} that decrypted but could not be integrated:`, _DocumentSyncProvider.logDetail(outcome.error));
            this.skippedUndecodablePayload = true;
            decodedCompleteBatch = false;
          } else if (!outcome.ok) {
            console.error(`[DocumentSync] Update at seq ${update.sequence} applied, but a Y.Doc listener threw while handling it (editor/binding failure, not a bad payload):`, outcome.error);
            this.config.onEditorBindingError?.(outcome.error);
          }
        }
      }
      this.lastSeq = Math.max(this.lastSeq, update.sequence);
    }
    if (this.config.replica) {
      try {
        const durablePageCursor = decodedCompleteBatch && !msg.hasMore && this.serverCapability === "explicit-head" ? msg.serverHead : msg.cursor;
        const appliedCompleteBatch = await this.config.replica.applyRemoteUpdates(
          replicaUpdates,
          decodedCompleteBatch ? durablePageCursor : this.config.replica.getLastServerSeq()
        );
        if (!appliedCompleteBatch) {
          decodedCompleteBatch = false;
          this.skippedUndecodablePayload = true;
        }
        if (!decodedCompleteBatch && this.config.replica.isComplete()) {
          await this.config.replica.markIncomplete();
        }
      } catch (err) {
        console.warn("[DocumentSync] Failed to apply/persist validated remote batch:", err);
        this.skippedUndecodablePayload = true;
        await this.config.replica.markIncomplete();
      }
    }
    if (msg.hasMore) {
      this.lastSeq = msg.cursor;
      this.requestSync();
      return;
    }
    if (!this.synced) {
      await this.config.replica?.completeCleanServerHydration(
        !this.skippedUndecodablePayload
      );
      this.synced = true;
      if (this.serverCapability === "explicit-head") {
        this.lastSeq = Math.max(this.lastSeq, msg.serverHead);
      }
      this.config.onFirstSyncComplete?.(msg.serverHasState === false);
      this.notifyContentChanged();
      if (this.hasPendingLocalUpdates()) {
        await this.replayPendingUpdate();
      } else {
        this.setStatus("connected");
        await this.pushLocalState(msg);
      }
      this.startCompactionTimer();
    }
  }
  async handleUpdateBroadcast(msg) {
    let updateBytes;
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "inbound-broadcast", {
        sequence: msg.sequence,
        ivLength: msg.iv?.length ?? 0,
        wireLength: msg.encryptedUpdate?.length ?? 0,
        viaReplica: Boolean(this.config.replica)
      });
    }
    const stateBefore = COLLAB_CONNECTION_DIAGNOSTICS_COMPILED ? encodeStateVector(this.ydoc) : null;
    try {
      updateBytes = await this.decodeFromWire(
        msg.encryptedUpdate,
        msg.iv
      );
      if (this.config.replica) {
        const applied = await this.config.replica.applyRemoteUpdates(
          [{ update: updateBytes, source: "remote", serverSequence: msg.sequence }],
          // A broadcast sequence does not prove contiguous coverage below it.
          // The next sync response persists an authoritative page cursor.
          this.config.replica.getLastServerSeq(),
          { coalescePersistence: true }
        );
        if (!applied) {
          this.skippedUndecodablePayload = true;
          if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.close();
          return;
        }
      } else {
        const outcome = this.applyDecodedUpdate(updateBytes, REMOTE_ORIGIN);
        if (!outcome.ok && !outcome.integrated) {
          throw outcome.error;
        }
        if (!outcome.ok) {
          console.error(`[DocumentSync] Broadcast at seq ${msg.sequence} applied, but a Y.Doc listener threw while handling it (editor/binding failure, not a bad payload):`, outcome.error);
          this.config.onEditorBindingError?.(outcome.error);
        }
      }
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED && stateBefore) {
        const stateAfter = encodeStateVector(this.ydoc);
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "inbound-applied", {
          sequence: msg.sequence,
          decodedBytes: updateBytes.length,
          docChanged: stateBefore.length !== stateAfter.length || stateAfter.some((byte, index) => byte !== stateBefore[index])
        });
      }
    } catch (err) {
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "inbound-skipped", {
          sequence: msg.sequence,
          ivLength: msg.iv?.length ?? 0,
          reason: err instanceof Error ? err.message : String(err)
        });
      }
      console.warn(`[DocumentSync] Skipping undecodable or unpersisted broadcast at seq ${msg.sequence}:`, _DocumentSyncProvider.logDetail(err));
      this.skippedUndecodablePayload = true;
      if (this.config.replica) {
        try {
          await this.config.replica.markIncomplete();
        } catch {
        }
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.close();
      this.lastSeq = Math.max(this.lastSeq, msg.sequence);
      return;
    }
    this.lastSeq = Math.max(this.lastSeq, msg.sequence);
    this.config.onRemoteUpdate?.(REMOTE_ORIGIN);
    this.notifyContentChanged();
  }
  async handleAwarenessBroadcast(msg) {
    if (msg.fromUserId === this.memberId) return;
    try {
      const stateBytes = await this.decodeFromWire(
        msg.encryptedState,
        msg.iv
      );
      const state = JSON.parse(
        new TextDecoder().decode(stateBytes)
      );
      if (state.nimbalystDeparture?.version === 1) {
        this.awarenessStates.delete(msg.fromUserId);
        this.awarenessTimestamps.delete(msg.fromUserId);
      } else {
        this.awarenessStates.set(msg.fromUserId, state);
        this.awarenessTimestamps.set(msg.fromUserId, Date.now());
      }
      this.notifyAwarenessListeners();
    } catch (err) {
      console.error("[DocumentSync] Failed to decrypt awareness:", err);
    }
  }
  // --------------------------------------------------------------------------
  // Local Update Observation
  // --------------------------------------------------------------------------
  /**
   * Watch the Y.Doc for local updates and send them to the server.
   */
  setupUpdateObserver() {
    if (this.updateObserverDispose) return;
    const handler = async (update, origin) => {
      if (this.config.replica?.isInternalOrigin(origin) || origin === REMOTE_ORIGIN || origin === SNAPSHOT_ORIGIN || origin === PERSISTED_PENDING_ORIGIN) {
        return;
      }
      try {
        this.config.onLocalUpdate?.();
      } catch (error) {
        console.warn("[DocumentSync] onLocalUpdate callback failed:", error);
      }
      this.notifyContentChanged();
      this.enqueuePendingLocalUpdate(update);
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.synced) {
        await this.replayPendingUpdate();
      }
    };
    this.ydoc.on("update", handler);
    this.updateObserverDispose = () => this.ydoc.off("update", handler);
  }
  teardownUpdateObserver() {
    this.updateObserverDispose?.();
    this.updateObserverDispose = null;
  }
  notifyContentChanged() {
    if (this.skippedUndecodablePayload) return;
    try {
      this.config.onContentChanged?.(this.ydoc);
    } catch (err) {
      console.warn("[DocumentSync] Content-change callback failed:", err);
    }
  }
  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  send(msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }
  getRoomId() {
    return `org:${this.config.orgId}:doc:${this.config.documentId}`;
  }
  enqueuePendingLocalUpdate(update) {
    this.queuedPendingUpdate = this.queuedPendingUpdate ? mergeUpdates([this.queuedPendingUpdate, update]) : update.slice();
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.synced) {
      this.setStatus("offline-unsynced");
    } else if (this.replayingClientUpdateId && this.surfaceReplayStatus) {
      this.setStatus("replaying");
    }
    this.schedulePendingPersist();
  }
  setStatus(status) {
    if (this.status === status) return;
    const previousStatus = this.status;
    this.status = status;
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "status", {
        from: previousStatus,
        to: status
      });
    }
    this.config.onStatusChange?.(status);
    for (const listener of this.statusListeners) listener(status);
  }
  /**
   * After initial sync, check if the local Y.Doc has content that the
   * server doesn't know about. This happens when content was bootstrapped
   * locally (e.g., initial share seeding) before the WebSocket connected,
   * or when a previous connection failed after bootstrap but before the
   * update could be sent.
   *
   * We compute the diff between what the server sent us and our local state
   * and send it as an update.
   */
  async pushLocalState(syncMsg) {
    if (syncMsg.serverHasState !== false) return;
    const diff = encodeStateAsUpdate(this.ydoc);
    if (diff.length <= 2) return;
    console.log("[DocumentSync] Pushing local state to server after sync, update size:", diff.length);
    this.enqueuePendingLocalUpdate(diff);
    await this.replayPendingUpdate();
  }
  async replayPendingUpdate() {
    if (this.replayingClientUpdateId) {
      return;
    }
    if (!this.queuedPendingUpdate && this.config.replica) {
      this.queuedPendingUpdate = this.config.replica.getPendingOutboxUpdate();
    }
    if (!this.queuedPendingUpdate) {
      this.setStatus("connected");
      return;
    }
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.synced) {
      this.setStatus("offline-unsynced");
      return;
    }
    try {
      const replicaReplay = this.config.replica && this.config.replica.getState() !== "unavailable" ? this.config.replica.beginOutboxReplay() : Promise.resolve(null);
      const pendingUpdate = this.queuedPendingUpdate;
      this.inflightPendingUpdate = pendingUpdate;
      this.queuedPendingUpdate = null;
      this.surfaceReplayStatus = this.status !== "connected";
      let durableBatch = await replicaReplay;
      if (this.config.replica && !durableBatch) {
        const durablePending = this.config.replica.getPendingOutboxUpdate();
        if (durablePending) {
          this.inflightPendingUpdate = null;
          this.queuedPendingUpdate = durablePending;
          this.surfaceReplayStatus = false;
          this.setStatus("offline-unsynced");
          return;
        }
        if (this.config.replica.getState() === "ready") {
          await this.config.replica.persistPendingOutboxUpdate(pendingUpdate);
          durableBatch = await this.config.replica.beginOutboxReplay();
        }
        if (!durableBatch && this.config.replica.getState() !== "unavailable") {
          this.inflightPendingUpdate = null;
          this.queuedPendingUpdate = this.config.replica.getPendingOutboxUpdate();
          this.surfaceReplayStatus = false;
          this.setStatus(this.queuedPendingUpdate ? "offline-unsynced" : "connected");
          return;
        }
      }
      const updateToSend = durableBatch?.update ?? pendingUpdate;
      const clientUpdateId = durableBatch?.batchId ?? (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
      this.inflightPendingUpdate = updateToSend;
      this.replayingClientUpdateId = clientUpdateId;
      this.replayingReplicaOutboxIds = durableBatch ? durableBatch.batchIds : [];
      this.replayStartedAt ??= Date.now();
      this.replayAttemptCount += 1;
      const { encrypted, iv } = await this.encodeForWire(updateToSend);
      if (this.surfaceReplayStatus) {
        this.setStatus("replaying");
      } else {
        this.setStatus("connected");
      }
      this.send({
        type: "docUpdate",
        encryptedUpdate: encrypted,
        iv,
        clientUpdateId
      });
      this.scheduleReplayAckTimeout(clientUpdateId);
    } catch (err) {
      this.clearReplayAckTimer();
      console.error("[DocumentSync] Failed to replay pending local update:", err);
      if (this.inflightPendingUpdate) {
        this.queuedPendingUpdate = this.config.replica ? this.config.replica.getPendingOutboxUpdate() : this.queuedPendingUpdate ? mergeUpdates([this.inflightPendingUpdate, this.queuedPendingUpdate]) : this.inflightPendingUpdate;
        this.inflightPendingUpdate = null;
      }
      this.replayingClientUpdateId = null;
      this.replayingReplicaOutboxIds = [];
      this.surfaceReplayStatus = false;
      this.schedulePendingPersist();
      this.setStatus("offline-unsynced");
    }
  }
  async handleUpdateAck(msg) {
    this.lastSeq = Math.max(this.lastSeq, msg.sequence);
    if (msg.clientUpdateId !== this.replayingClientUpdateId) {
      return;
    }
    this.clearReplayAckTimer();
    if (this.config.replica && this.replayingReplicaOutboxIds.length > 0) {
      try {
        await this.config.replica.acknowledgeOutbox(
          this.replayingReplicaOutboxIds,
          msg.sequence
        );
      } catch (error) {
        console.warn("[DocumentSync] Failed to persist outbox acknowledgement:", error);
        this.requeueInflightPendingUpdate();
        this.setStatus("offline-unsynced");
        return;
      }
    }
    this.config.onOfflineMetric?.({
      metric: "outbox_replay",
      durationMs: this.replayStartedAt === null ? 0 : Date.now() - this.replayStartedAt,
      retryCount: Math.max(0, this.replayAttemptCount - 1),
      rejectionCode: null
    });
    this.replayStartedAt = null;
    this.replayAttemptCount = 0;
    this.replayingReplicaOutboxIds = [];
    this.finishReplayingPendingUpdate();
  }
  async handleWriteRejection(errorCode, clientUpdateId) {
    if (!clientUpdateId || clientUpdateId !== this.replayingClientUpdateId) {
      return;
    }
    const replica = this.config.replica;
    const rejectedIds = [...this.replayingReplicaOutboxIds];
    if (replica && rejectedIds.length === 0) {
      return;
    }
    this.clearReplayAckTimer();
    this.config.onOfflineMetric?.({
      metric: "outbox_replay",
      durationMs: this.replayStartedAt === null ? 0 : Date.now() - this.replayStartedAt,
      retryCount: Math.max(0, this.replayAttemptCount - 1),
      rejectionCode: errorCode
    });
    if (!isConfirmedOutboxRevocationCode(errorCode)) {
      if (replica) {
        try {
          await replica.recordOutboxError(rejectedIds, errorCode);
        } catch (error) {
          console.warn("[DocumentSync] Failed to persist retryable outbox error:", error);
        }
      }
      this.requeueInflightPendingUpdate();
      this.setStatus("offline-unsynced");
      if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.close();
      return;
    }
    if (replica) await replica.rejectOutbox(rejectedIds, errorCode);
    this.inflightPendingUpdate = null;
    this.replayingClientUpdateId = null;
    this.replayingReplicaOutboxIds = [];
    this.queuedPendingUpdate = replica ? replica.getPendingOutboxUpdate() : null;
    this.surfaceReplayStatus = false;
    this.replayStartedAt = null;
    this.replayAttemptCount = 0;
    this.setStatus("error");
    this.notifyPendingWriteWaiters();
  }
  schedulePendingPersist() {
    if (!this.config.onPendingUpdateChange) return;
    if (this.pendingPersistTimer) {
      clearTimeout(this.pendingPersistTimer);
    }
    this.pendingPersistTimer = setTimeout(() => {
      this.pendingPersistTimer = null;
      void this.persistLegacyPendingUpdate();
    }, 250);
  }
  flushPendingPersistImmediately() {
    if (!this.config.onPendingUpdateChange) return;
    if (this.pendingPersistTimer) {
      clearTimeout(this.pendingPersistTimer);
      this.pendingPersistTimer = null;
    }
    void this.persistLegacyPendingUpdate();
  }
  async persistLegacyPendingUpdate() {
    if (!this.config.onPendingUpdateChange) return;
    if (this.config.replica) {
      await this.config.replica.flush();
      if (this.config.replica.getState() !== "unavailable") return;
    }
    const mergedPendingUpdate = this.getMergedPendingUpdate();
    await this.config.onPendingUpdateChange(
      mergedPendingUpdate ? uint8ArrayToBase64(mergedPendingUpdate) : null
    );
  }
  handleDisconnect() {
    this.decisionClient.disconnect();
    const shouldReconnect = !this.suppressReconnect;
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "socket-detach", {
        shouldReconnect
      });
    }
    this.suppressReconnect = false;
    this.clearReplayAckTimer();
    this.ws = null;
    this.synced = false;
    this.connecting = false;
    this.cursorLagRecordedForConnection = false;
    this.requeueInflightPendingUpdate();
    this.stopAwarenessCleanup();
    this.clearAwarenessThrottle();
    this.stopCompactionTimer();
    this.awarenessStates.clear();
    this.awarenessTimestamps.clear();
    this.notifyAwarenessListeners();
    this.setStatus(
      this.hasPendingLocalUpdates() ? "offline-unsynced" : "disconnected"
    );
    if (shouldReconnect) {
      this.scheduleReconnect();
    }
  }
  hasPendingLocalUpdates() {
    return !!(this.queuedPendingUpdate || this.inflightPendingUpdate);
  }
  hasUnsettledPendingWrites() {
    return !!(this.queuedPendingUpdate || this.inflightPendingUpdate || this.replayingClientUpdateId);
  }
  notifyPendingWriteWaiters() {
    for (const waiter of Array.from(this.pendingWriteWaiters)) {
      waiter();
    }
  }
  getMergedPendingUpdate() {
    if (this.queuedPendingUpdate && this.inflightPendingUpdate) {
      return mergeUpdates([
        this.inflightPendingUpdate,
        this.queuedPendingUpdate
      ]);
    }
    return this.queuedPendingUpdate ?? this.inflightPendingUpdate;
  }
  requeueInflightPendingUpdate() {
    this.clearReplayAckTimer();
    if (!this.inflightPendingUpdate) {
      this.replayingReplicaOutboxIds = [];
      this.surfaceReplayStatus = false;
      this.notifyPendingWriteWaiters();
      return;
    }
    this.queuedPendingUpdate = this.config.replica ? this.config.replica.getPendingOutboxUpdate() : this.queuedPendingUpdate ? mergeUpdates([this.inflightPendingUpdate, this.queuedPendingUpdate]) : this.inflightPendingUpdate;
    this.inflightPendingUpdate = null;
    this.replayingClientUpdateId = null;
    this.replayingReplicaOutboxIds = [];
    this.surfaceReplayStatus = false;
    this.schedulePendingPersist();
    this.notifyPendingWriteWaiters();
  }
  finishReplayingPendingUpdate() {
    this.clearReplayAckTimer();
    this.inflightPendingUpdate = null;
    this.replayingClientUpdateId = null;
    if (this.config.replica) {
      this.queuedPendingUpdate = this.config.replica.getPendingOutboxUpdate();
    }
    this.surfaceReplayStatus = false;
    this.schedulePendingPersist();
    this.notifyPendingWriteWaiters();
    if (this.synced && this.queuedPendingUpdate) {
      void this.replayPendingUpdate();
      return;
    }
    if (this.synced) {
      this.setStatus("connected");
    }
  }
  scheduleReconnect() {
    if (this.destroyed || this.reconnectTimer) {
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "reconnect-skipped", {
          reason: this.destroyed ? "destroyed" : "timer-present"
        });
      }
      return;
    }
    const delay = Math.min(
      _DocumentSyncProvider.RECONNECT_BASE_MS * Math.pow(2, this.reconnectAttempt),
      _DocumentSyncProvider.RECONNECT_MAX_MS
    );
    const jittered = delay * (0.5 + Math.random());
    this.reconnectAttempt++;
    if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
      emitCollabConnectionEvent(this, "DocumentSyncProvider", "reconnect-scheduled", {
        attempt: this.reconnectAttempt,
        delayMs: Math.round(jittered)
      });
    }
    console.log(`[DocumentSync] Reconnecting in ${Math.round(jittered / 1e3)}s (attempt ${this.reconnectAttempt})`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.destroyed) {
        if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
          emitCollabConnectionEvent(this, "DocumentSyncProvider", "reconnect-fired", {
            attempt: this.reconnectAttempt
          });
        }
        this.connect().catch((err) => {
          console.error("[DocumentSync] Reconnect failed:", err);
        });
      }
    }, jittered);
  }
  cancelReconnect() {
    if (this.reconnectTimer) {
      if (COLLAB_CONNECTION_DIAGNOSTICS_COMPILED) {
        emitCollabConnectionEvent(this, "DocumentSyncProvider", "reconnect-cancelled", {
          attempt: this.reconnectAttempt
        });
      }
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  /**
   * Immediately reconnect, cancelling any pending backoff and resetting attempts.
   * Called externally when the network has been confirmed available (e.g. after
   * the CollabV3 index has reached `synced`). This intentionally tears down any
   * existing socket first: after sleep/wake a WebSocket can remain "open" while
   * the underlying transport is dead, and a forced reconnect is cheaper than
   * waiting for that zombie socket to notice.
   *
   * Falls back to normal backoff on failure.
   */
  reconnectNow() {
    if (this.destroyed) return;
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) return;
    this.cancelReconnect();
    this.reconnectAttempt = 0;
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
      }
      this.ws = null;
    }
    this.connecting = false;
    console.log("[DocumentSync] Network available, attempting immediate reconnect");
    this.connect().catch((err) => {
      console.error("[DocumentSync] reconnectNow failed:", err);
      this.scheduleReconnect();
    });
  }
  scheduleReplayAckTimeout(clientUpdateId) {
    this.clearReplayAckTimer();
    this.replayAckTimer = setTimeout(() => {
      this.replayAckTimer = null;
      if (this.replayingClientUpdateId !== clientUpdateId) {
        return;
      }
      console.warn(
        "[DocumentSync] Timed out waiting for docUpdateAck, forcing reconnect for pending replay",
        {
          roomId: this.getRoomId(),
          clientUpdateId,
          hasQueuedPendingUpdate: !!this.queuedPendingUpdate,
          hasInflightPendingUpdate: !!this.inflightPendingUpdate,
          lastSeq: this.lastSeq
        }
      );
      this.setStatus("offline-unsynced");
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.close();
        } catch (err) {
          console.error("[DocumentSync] Failed to close WebSocket after replay timeout:", err);
          this.requeueInflightPendingUpdate();
          this.synced = false;
          this.scheduleReconnect();
        }
        return;
      }
      this.requeueInflightPendingUpdate();
      this.synced = false;
      this.scheduleReconnect();
    }, _DocumentSyncProvider.REPLAY_ACK_TIMEOUT_MS);
  }
  clearReplayAckTimer() {
    if (this.replayAckTimer) {
      clearTimeout(this.replayAckTimer);
      this.replayAckTimer = null;
    }
  }
  /**
   * Start periodic cleanup of stale remote awareness states.
   * Removes entries from users who haven't sent an update recently.
   */
  startAwarenessCleanup() {
    this.stopAwarenessCleanup();
    this.awarenessCleanupTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [userId, timestamp] of this.awarenessTimestamps) {
        if (now - timestamp > AWARENESS_STALE_TIMEOUT_MS) {
          this.awarenessStates.delete(userId);
          this.awarenessTimestamps.delete(userId);
          changed = true;
        }
      }
      if (changed) {
        this.notifyAwarenessListeners();
      }
    }, AWARENESS_STALE_TIMEOUT_MS / 2);
  }
  stopAwarenessCleanup() {
    if (this.awarenessCleanupTimer) {
      clearInterval(this.awarenessCleanupTimer);
      this.awarenessCleanupTimer = null;
    }
  }
  notifyAwarenessListeners() {
    const snapshot = this.getAwarenessStates();
    for (const listener of this.awarenessListeners) {
      listener(snapshot);
    }
  }
  // --------------------------------------------------------------------------
  // Compaction
  // --------------------------------------------------------------------------
  startCompactionTimer() {
    if (this.compactionTimer) return;
    this.lastCompactionAttemptAt = Date.now();
    this.compactionTimer = setInterval(() => {
      void this.maybeCompact();
    }, COMPACTION_CHECK_INTERVAL_MS);
  }
  stopCompactionTimer() {
    if (this.compactionTimer) {
      clearInterval(this.compactionTimer);
      this.compactionTimer = null;
    }
  }
  /**
   * Lowest scoped member id wins. Awareness misses (a connected member who hasn't sent
   * awareness yet) can briefly cause both candidates to elect themselves;
   * the server tolerates duplicate snapshots (older row is dropped by
   * `DELETE FROM snapshots WHERE replaces_up_to < ?`).
   */
  amCompactionElector() {
    let lowest = this.memberId;
    for (const remoteUserId of this.awarenessStates.keys()) {
      if (remoteUserId < lowest) lowest = remoteUserId;
    }
    return lowest === this.memberId;
  }
  async maybeCompact() {
    if (this.destroyed) return;
    if (!this.synced) return;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    if (this.pendingCompactionId) return;
    if (this.queuedPendingUpdate || this.inflightPendingUpdate) return;
    if (this.replayingClientUpdateId) return;
    if (this.config.replica?.hasPendingOutbox()) return;
    if (this.skippedUndecodablePayload) return;
    const updatesSinceSnapshot = this.lastSeq - this.lastSnapshotSeq;
    if (updatesSinceSnapshot <= 0) return;
    const now = Date.now();
    const timeSinceLastAttempt = now - this.lastCompactionAttemptAt;
    const updateThresholdReached = updatesSinceSnapshot >= COMPACTION_UPDATE_THRESHOLD;
    const timeThresholdReached = updatesSinceSnapshot >= COMPACTION_TIME_MIN_UPDATES && timeSinceLastAttempt >= COMPACTION_TIME_THRESHOLD_MS;
    if (!updateThresholdReached && !timeThresholdReached) return;
    if (!this.amCompactionElector()) return;
    await this.sendCompactionSnapshot();
  }
  async sendCompactionSnapshot() {
    const currentSeq = this.lastSeq;
    const stateBytes = encodeStateAsUpdate(this.ydoc);
    if (stateBytes.byteLength <= 2) {
      console.warn(
        `[DocumentSync] Refusing empty-doc compaction (lastSeq=${currentSeq}); leaving server rows untouched`
      );
      return;
    }
    try {
      const { encrypted, iv } = await this.encodeForWire(stateBytes);
      const clientCompactId = `compact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      this.send({
        type: "docCompact",
        encryptedState: encrypted,
        iv,
        replacesUpTo: currentSeq,
        clientCompactId
      });
      this.pendingCompactionId = clientCompactId;
      this.scheduleCompactionAckTimeout(clientCompactId);
      this.lastCompactionAttemptAt = Date.now();
      console.log(
        `[DocumentSync] Sent docCompact awaiting ack: replacesUpTo=${currentSeq}, snapshotBytes=${stateBytes.byteLength}`
      );
    } catch (err) {
      console.warn("[DocumentSync] Failed to send compaction snapshot:", err);
    }
  }
  /**
   * Deliberately replace the server's authoritative state for this room with the
   * CURRENT local Y.Doc, dropping every prior server row -- including rows this
   * client could not decrypt. This is the recovery override for a room whose
   * server state became undecryptable (backup review HIGH finding 1): after a
   * plaintext backup is applied into the otherwise-empty Y.Doc, this promotes it
   * to the sole authoritative snapshot via `docCompact(replacesUpTo = lastSeq)`.
   *
   * Unlike routine compaction it bypasses the `hasUndecodedContent()` guard --
   * that guard protects against ACCIDENTALLY burying unreadable rows, but here
   * discarding them is the whole point. It still refuses an empty snapshot so a
   * blank Y.Doc can never wipe a room. Resolves true once the server acks.
   */
  async forceReplaceServerState(timeoutMs = 15e3) {
    return this.sendAuthoritativeSnapshot(timeoutMs, {
      allowEmpty: false,
      allowUndecoded: true,
      operation: "force-replace"
    });
  }
  /**
   * Finalize a successfully decoded pre-migration room under server-managed
   * custody. Unlike the disaster-recovery override above, this refuses to bury
   * any payload the client could not decrypt. Empty Y.Docs are allowed because
   * a decoded-but-empty legacy room still needs a current DEK snapshot.
   */
  async finalizeServerManagedState(timeoutMs = 15e3) {
    return this.sendAuthoritativeSnapshot(timeoutMs, {
      allowEmpty: true,
      allowUndecoded: false,
      operation: "migration-finalize"
    });
  }
  async sendAuthoritativeSnapshot(timeoutMs, options) {
    if (this.destroyed) throw new Error("Cannot force-replace a destroyed room provider");
    if (!this.synced) throw new Error("Cannot force-replace before the room has synced");
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("Cannot force-replace while the room is disconnected");
    }
    if (!options.allowUndecoded && this.hasUndecodedContent()) {
      throw new Error("Cannot finalize a room containing content this device could not decrypt");
    }
    await this.waitForPendingWrites(timeoutMs);
    const stateBytes = encodeStateAsUpdate(this.ydoc);
    if (!options.allowEmpty && stateBytes.byteLength <= 2) {
      throw new Error("Refusing to force-replace the room with an empty document");
    }
    const { encrypted, iv } = await this.encodeForWire(stateBytes);
    const clientCompactId = `${options.operation}-${this.lastSeq}-${this.memberId}-${this.forceReplaceCounter++}`;
    const acked = new Promise((resolve) => {
      const timer = setTimeout(() => {
        if (this.forceReplaceWaiter?.clientCompactId === clientCompactId) {
          this.forceReplaceWaiter = null;
          if (this.pendingCompactionId === clientCompactId) this.pendingCompactionId = null;
          resolve(false);
        }
      }, timeoutMs);
      this.forceReplaceWaiter = {
        clientCompactId,
        resolve: (accepted) => {
          clearTimeout(timer);
          resolve(accepted);
        }
      };
    });
    this.pendingCompactionId = clientCompactId;
    this.send({
      type: "docCompact",
      encryptedState: encrypted,
      iv,
      replacesUpTo: this.lastSeq,
      clientCompactId
    });
    return acked;
  }
  handleCompactionAck(msg) {
    if (msg.clientCompactId && msg.clientCompactId !== this.pendingCompactionId) {
      return;
    }
    this.clearCompactionAckTimer();
    this.pendingCompactionId = null;
    this.lastCompactionAttemptAt = Date.now();
    const waiter = this.forceReplaceWaiter;
    if (waiter && (!msg.clientCompactId || waiter.clientCompactId === msg.clientCompactId)) {
      this.forceReplaceWaiter = null;
      waiter.resolve(!!msg.accepted);
    }
    if (!msg.accepted) {
      console.warn(
        `[DocumentSync] Compaction rejected: ${msg.error?.code ?? "unknown"} ${msg.error?.message ?? ""}`.trim()
      );
      return;
    }
    this.lastSnapshotSeq = Math.max(this.lastSnapshotSeq, msg.replacesUpTo);
    console.log(
      `[DocumentSync] Compaction acknowledged: replacesUpTo=${msg.replacesUpTo}${msg.deduplicated ? ", deduplicated=true" : ""}`
    );
  }
  scheduleCompactionAckTimeout(clientCompactId) {
    this.clearCompactionAckTimer();
    this.compactionAckTimer = setTimeout(() => {
      this.compactionAckTimer = null;
      if (this.pendingCompactionId !== clientCompactId) return;
      this.pendingCompactionId = null;
      console.warn("[DocumentSync] Compaction acknowledgement timed out; will retry when eligible");
    }, _DocumentSyncProvider.COMPACTION_ACK_TIMEOUT_MS);
  }
  clearCompactionAckTimer() {
    if (!this.compactionAckTimer) return;
    clearTimeout(this.compactionAckTimer);
    this.compactionAckTimer = null;
  }
};

// scripts/editor-models.entry.mjs
var editorCodecs = createEditorCodecs([
  ExcalidrawCollabContentAdapter,
  CsvCollabContentAdapter,
  DataModelCollabContentAdapter,
  MockupHtmlCollabContentAdapter,
  CalcSheetCollabContentAdapter,
  mindmapCodec,
  canvasCollabCodec
]);
var EDITOR_MODELS_VERSION = 2;
export {
  DocumentSyncProvider,
  EDITOR_MODELS_VERSION,
  LayoutEngine,
  applyMindmapOperations,
  createArrow,
  createEmptyDocument,
  createFrame,
  createLabeledRectangle,
  createRectangle,
  createText,
  editorCodecs,
  parseDocument,
  serializeDocument
};
