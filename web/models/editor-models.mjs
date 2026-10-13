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
    const id = isRoot ? rootId : generateNodeId();
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    const parentId = stack.length > 0 ? stack[stack.length - 1].id : null;
    nodes[id] = {
      id,
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
      nodes[parentId].childIds.push(id);
    }
    stack.push({ id, depth });
    return id;
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
function applyMindmapOperations(document, operations) {
  if (operations.length === 0) return { document, createdNodeIds: {} };
  if (operations.length > 200) throw new Error("A batch may contain at most 200 operations");
  let nodes = Object.fromEntries(
    Object.entries(document.nodes).map(([id, node]) => [id, {
      ...node,
      childIds: [...node.childIds],
      tags: [...node.tags]
    }])
  );
  const aliases = {};
  const resolve = (value) => aliases[value] ?? value;
  const requireNode = (value) => {
    const id = resolve(value);
    const node = nodes[id];
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
      nodes[node.parentId] = { ...nodes[node.parentId], childIds: nodes[node.parentId].childIds.filter((id) => id !== nodeId) };
    }
    delete nodes[nodeId];
  };
  for (const operation of operations) {
    if (operation.type === "add") {
      const parent = requireNode(operation.parentId);
      const id = generateNodeId();
      if (operation.alias) {
        if (aliases[operation.alias] || nodes[operation.alias]) throw new Error(`Duplicate alias ${operation.alias}`);
        aliases[operation.alias] = id;
      }
      const childIds = [...parent.childIds];
      const index = operation.index === void 0 ? childIds.length : Math.max(0, Math.min(childIds.length, operation.index));
      childIds.splice(index, 0, id);
      nodes[parent.id] = { ...parent, childIds };
      nodes[id] = {
        id,
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
      if (node.id === document.rootId) throw new Error("Cannot delete the root node");
      deleteRecursive(node.id);
    } else if (operation.type === "move") {
      const node = requireNode(operation.nodeId);
      const requestedParent = requireNode(operation.newParentId);
      if (node.id === document.rootId) throw new Error("Cannot move the root node");
      if (isDescendant(node.id, requestedParent.id)) throw new Error(`Cannot move ${node.id} under its descendant ${requestedParent.id}`);
      if (node.parentId && nodes[node.parentId]) {
        nodes[node.parentId] = { ...nodes[node.parentId], childIds: nodes[node.parentId].childIds.filter((id) => id !== node.id) };
      }
      const parent = nodes[requestedParent.id];
      const childIds = [...parent.childIds];
      const index = operation.index === void 0 ? childIds.length : Math.max(0, Math.min(childIds.length, operation.index));
      childIds.splice(index, 0, node.id);
      nodes[parent.id] = { ...parent, childIds };
      nodes[node.id] = { ...node, parentId: parent.id, pinned: false };
    }
  }
  return { document: { ...document, nodes }, createdNodeIds: aliases };
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

// scripts/editor-models.entry.mjs
var EDITOR_MODELS_VERSION = 1;
export {
  EDITOR_MODELS_VERSION,
  LayoutEngine,
  applyMindmapOperations,
  createArrow,
  createEmptyDocument,
  createFrame,
  createLabeledRectangle,
  createRectangle,
  createText,
  parseDocument,
  serializeDocument
};
