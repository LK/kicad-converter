var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// lib/kicad-pcb/convert-circuit-json-to-kicad-pcb.ts
import "@tscircuit/soup";
import { transformPCBElements as transformPCBElements2 } from "@tscircuit/soup-util";
import { scale as scale2, compose, translate } from "transformation-matrix";

// lib/kicad-pcb/convert-kicad-pcb-to-circuit-json.ts
import * as CJ from "@tscircuit/soup";
import { transformPCBElements } from "@tscircuit/soup-util";
import { scale } from "transformation-matrix";
function convertKiCadPcbToCircuitJson(kicadPcb) {
  const circuitJsonArray = [];
  if (kicadPcb.footprints) {
    for (const footprint of kicadPcb.footprints) {
      if (footprint.pads) {
        for (const pad of footprint.pads) {
          const pcbPads = convertPadToPcbPad(pad, footprint);
          circuitJsonArray.push(...pcbPads);
        }
      }
    }
  }
  if (kicadPcb.segments) {
    const segmentsByNet = groupSegmentsByNet(kicadPcb.segments);
    for (const netId in segmentsByNet) {
      const segments = segmentsByNet[netId];
      const pcbTraces = convertSegmentsToPcbTraces(segments, netId);
      circuitJsonArray.push(...pcbTraces);
    }
  }
  if (kicadPcb.vias) {
    for (const via of kicadPcb.vias) {
      const pcbVia = convertViaToPcbVia(via);
      circuitJsonArray.push(pcbVia);
    }
  }
  transformPCBElements(circuitJsonArray, scale(1, -1));
  return circuitJsonArray;
}
function generateUniqueId() {
  return "id_" + Math.random().toString(36).substr(2, 9);
}
function convertPadToPcbPad(pad, footprint) {
  const pads = [];
  const position = {
    x: pad.at[0] + footprint.at.x,
    y: pad.at[1] + footprint.at.y
  };
  const padShape = pad.shape.toLowerCase();
  if (pad.type === "smd") {
    for (const kicadLayer of pad.layers) {
      const layer = mapKicadLayerToTscircuitLayer(kicadLayer);
      if (!layer) continue;
      const pcb_smtpad2 = CJ.pcb_smtpad.safeParse({
        type: "pcb_smtpad",
        pcb_smtpad_id: pad.uuid || generateUniqueId(),
        shape: padShape === "roundrect" ? "rect" : padShape,
        x: position.x,
        y: position.y,
        width: pad.size[0],
        height: pad.size[1],
        layer,
        port_hints: [pad.number],
        pcb_component_id: footprint.uuid || generateUniqueId(),
        pcb_port_id: pad.uuid || generateUniqueId()
      });
      if (pcb_smtpad2.success) {
        pads.push(pcb_smtpad2.data);
      } else {
        console.warn(
          `Failed to parse pcb_smtpad "${pad.uuid}"`,
          pcb_smtpad2.error
        );
      }
    }
  } else if (pad.type === "thru_hole") {
    const isCircular = pad.size[0] === pad.size[1];
    const pcb_plated_hole2 = CJ.pcb_plated_hole.safeParse(
      isCircular ? {
        type: "pcb_plated_hole",
        pcb_plated_hole_id: pad.uuid || generateUniqueId(),
        shape: "circle",
        x: position.x,
        y: position.y,
        outer_diameter: pad.size[0],
        hole_diameter: pad.drill || pad.size[0] * 0.5,
        // Use drill size if available, otherwise assume half the pad size
        layers: pad.layers.map(mapKicadLayerToTscircuitLayer).filter(Boolean),
        port_hints: [pad.number],
        pcb_component_id: footprint.uuid || generateUniqueId(),
        pcb_port_id: pad.uuid || generateUniqueId()
      } : {
        type: "pcb_plated_hole",
        pcb_plated_hole_id: pad.uuid || generateUniqueId(),
        shape: padShape === "oval" ? "oval" : "pill",
        x: position.x,
        y: position.y,
        outer_width: pad.size[0],
        outer_height: pad.size[1],
        hole_width: pad.drill || pad.size[0] * 0.5,
        hole_height: pad.drill || pad.size[1] * 0.5,
        layers: pad.layers.map(mapKicadLayerToTscircuitLayer).filter(Boolean),
        port_hints: [pad.number],
        pcb_component_id: footprint.uuid || generateUniqueId(),
        pcb_port_id: pad.uuid || generateUniqueId()
      }
    );
    if (pcb_plated_hole2.success) {
      pads.push(pcb_plated_hole2.data);
    } else {
      console.warn(
        `Failed to parse pcb_plated_hole "${pad.uuid}"`,
        pcb_plated_hole2.error
      );
    }
  } else if (pad.type === "np_thru_hole") {
    const pcb_hole2 = CJ.pcb_hole.parse({
      type: "pcb_hole",
      pcb_hole_id: pad.uuid || generateUniqueId(),
      shape: "circle",
      x: position.x,
      y: position.y,
      outer_diameter: pad.size[0],
      hole_diameter: pad.drill || pad.size[0] * 0.5
    });
    pads.push(pcb_hole2);
  }
  return pads;
}
function groupSegmentsByNet(segments) {
  const segmentsByNet = {};
  for (const segment of segments) {
    if (!segmentsByNet[segment.net]) {
      segmentsByNet[segment.net] = [];
    }
    segmentsByNet[segment.net].push(segment);
  }
  return segmentsByNet;
}
function convertSegmentsToPcbTraces(segments, netId) {
  const pcbTraces = [];
  for (const segment of segments) {
    const route = [
      {
        route_type: "wire",
        x: segment.start[0],
        y: segment.start[1],
        width: segment.width,
        layer: mapKicadLayerToTscircuitLayer(segment.layer)
      },
      {
        route_type: "wire",
        x: segment.end[0],
        y: segment.end[1],
        width: segment.width,
        layer: mapKicadLayerToTscircuitLayer(segment.layer)
      }
    ];
    pcbTraces.push(
      CJ.pcb_trace.parse({
        type: "pcb_trace",
        pcb_trace_id: segment.uuid || generateUniqueId(),
        source_trace_id: `net_${segment.net}`,
        route_thickness_mode: "constant",
        should_round_corners: false,
        route
      })
    );
  }
  return pcbTraces;
}
function convertViaToPcbVia(via) {
  return CJ.pcb_via.parse({
    type: "pcb_via",
    x: `${via.at[0]}mm`,
    y: `${via.at[1]}mm`,
    outer_diameter: `${via.size}mm`,
    hole_diameter: `${via.drill}mm`,
    layers: via.layers.map(mapKicadLayerToTscircuitLayer).filter((layer) => layer !== null)
  });
}
function mapKicadLayerToTscircuitLayer(kicadLayer) {
  const layerMap = {
    "F.Cu": "top",
    "B.Cu": "bottom",
    "F.SilkS": "top",
    "B.SilkS": "bottom",
    // Add other necessary mappings for via layers
    "In1.Cu": "inner1",
    "In2.Cu": "inner2"
    // ... add more inner layers as needed
  };
  return layerMap[kicadLayer] ?? null;
}
function mapTscircuitLayerToKicadLayer(tscircuitLayer) {
  const layerMap = {
    top: "F.Cu",
    bottom: "B.Cu",
    inner1: "In1.Cu",
    inner2: "In2.Cu"
  };
  return layerMap[tscircuitLayer] ?? null;
}

// lib/kicad-pcb/convert-circuit-json-to-kicad-pcb.ts
import {
  getFullConnectivityMapFromCircuitJson
} from "circuit-json-to-connectivity-map";
function convertCircuitJsonToKiCadPcb(circuitJson) {
  const connMap = getFullConnectivityMapFromCircuitJson(circuitJson);
  circuitJson = transformPCBElements2(
    JSON.parse(JSON.stringify(circuitJson)),
    // Flip the Y axis and translate to center of A4 kicad sheet
    compose(scale2(1, -1), translate(148.5, -105))
  );
  const kicadPcb = {
    version: 20240108,
    generator: "tscircuit",
    generator_version: "1.0",
    general: {
      thickness: 1.6,
      legacy_teardrops: false
    },
    paper: "A4",
    layers: [
      {
        id: 0,
        name: "F.Cu",
        type: "signal"
      },
      {
        id: 31,
        name: "B.Cu",
        type: "signal"
      },
      {
        id: 32,
        name: "B.Adhes",
        type: "user",
        description: "B.Adhesive"
      },
      {
        id: 33,
        name: "F.Adhes",
        type: "user",
        description: "F.Adhesive"
      },
      {
        id: 34,
        name: "B.Paste",
        type: "user"
      },
      {
        id: 35,
        name: "F.Paste",
        type: "user"
      },
      {
        id: 36,
        name: "B.SilkS",
        type: "user",
        description: "B.Silkscreen"
      },
      {
        id: 37,
        name: "F.SilkS",
        type: "user",
        description: "F.Silkscreen"
      },
      {
        id: 38,
        name: "B.Mask",
        type: "user"
      },
      {
        id: 39,
        name: "F.Mask",
        type: "user"
      },
      {
        id: 40,
        name: "Dwgs.User",
        type: "user",
        description: "User.Drawings"
      },
      {
        id: 41,
        name: "Cmts.User",
        type: "user",
        description: "User.Comments"
      },
      {
        id: 42,
        name: "Eco1.User",
        type: "user",
        description: "User.Eco1"
      },
      {
        id: 43,
        name: "Eco2.User",
        type: "user",
        description: "User.Eco2"
      },
      {
        id: 44,
        name: "Edge.Cuts",
        type: "user"
      },
      {
        id: 45,
        name: "Margin",
        type: "user"
      },
      {
        id: 46,
        name: "B.CrtYd",
        type: "user",
        description: "B.Courtyard"
      },
      {
        id: 47,
        name: "F.CrtYd",
        type: "user",
        description: "F.Courtyard"
      },
      {
        id: 48,
        name: "B.Fab",
        type: "user"
      },
      {
        id: 49,
        name: "F.Fab",
        type: "user"
      },
      {
        id: 50,
        name: "User.1",
        type: "user"
      },
      {
        id: 51,
        name: "User.2",
        type: "user"
      },
      {
        id: 52,
        name: "User.3",
        type: "user"
      },
      {
        id: 53,
        name: "User.4",
        type: "user"
      },
      {
        id: 54,
        name: "User.5",
        type: "user"
      },
      {
        id: 55,
        name: "User.6",
        type: "user"
      },
      {
        id: 56,
        name: "User.7",
        type: "user"
      },
      {
        id: 57,
        name: "User.8",
        type: "user"
      },
      {
        id: 58,
        name: "User.9",
        type: "user"
      }
    ],
    setup: {
      pad_to_mask_clearance: 0,
      allow_soldermask_bridges_in_footprints: false,
      pcbplotparams: {
        layerselection: "0x00010fc_ffffffff",
        plot_on_all_layers_selection: "0x0000000_00000000",
        disableapertmacros: false,
        usegerberextensions: false,
        usegerberattributes: true,
        usegerberadvancedattributes: true,
        creategerberjobfile: true,
        svgprecision: 4,
        // @ts-expect-error
        excludeedgelayer: true,
        plotframeref: false,
        viasonmask: false,
        mode: 1,
        useauxorigin: false,
        hpglpennumber: 1,
        hpglpenspeed: 20,
        hpglpendiameter: 15,
        dxfpolygonmode: true,
        dxfimperialunits: true,
        dxfusepcbnewfont: true,
        psnegative: false,
        psa4output: false,
        plotreference: true,
        plotvalue: true,
        plotinvisibletext: false,
        sketchpadsonfab: false,
        subtractmaskfromsilk: false,
        outputformat: 1,
        mirror: false,
        drillshape: 1,
        scaleselection: 1,
        outputdirectory: ""
      }
    },
    nets: [],
    footprints: [],
    segments: [],
    vias: []
  };
  circuitJson.forEach((element) => {
    switch (element.type) {
      case "pcb_component":
        kicadPcb.footprints.push(
          convertPcbComponentToFootprint(element, circuitJson, connMap)
        );
        break;
      case "pcb_trace":
        kicadPcb.segments.push(...convertPcbTraceToSegments(element, connMap));
        break;
      case "pcb_via":
        kicadPcb.vias.push(convertPcbViaToVia(element, connMap));
        break;
      case "pcb_hole":
        kicadPcb.footprints.push(
          convertPcbHoleToFootprint(element)
        );
        break;
      case "pcb_plated_hole":
        kicadPcb.footprints.push(
          convertPcbPlatedHoleToFootprint(element, connMap)
        );
        break;
      case "pcb_board":
        kicadPcb.gr_lines = convertPcbBoardToEdgeCuts(element);
        break;
    }
  });
  for (const [netId, connections] of Object.entries(connMap.netMap)) {
    kicadPcb.nets.push({
      id: netIdToNumber(netId),
      name: netId
    });
  }
  return kicadPcb;
}
function convertPcbBoardToEdgeCuts(board) {
  const edgeCuts = [];
  const outline = board.outline || [
    {
      x: board.center.x - board.width / 2,
      y: board.center.y + board.height / 2
    },
    {
      x: board.center.x + board.width / 2,
      y: board.center.y + board.height / 2
    },
    {
      x: board.center.x + board.width / 2,
      y: board.center.y - board.height / 2
    },
    {
      x: board.center.x - board.width / 2,
      y: board.center.y - board.height / 2
    }
  ];
  for (let i = 0; i < outline.length; i++) {
    const start = outline[i];
    const end = outline[(i + 1) % outline.length];
    edgeCuts.push({
      start: [start.x, start.y],
      end: [end.x, end.y],
      layer: "Edge.Cuts",
      width: 0.1
    });
  }
  return edgeCuts;
}
function convertPcbViaToVia(via, connMap) {
  return {
    at: [via.x, via.y],
    size: via.outer_diameter,
    drill: via.hole_diameter,
    layers: via.layers.map((l) => mapTscircuitLayerToKicadLayer(l)),
    // TODO: Waiting on pcb_trace_id being available in Circuit JSON before we
    // can add nets for vias
    net: 0,
    uuid: `via_${via.x}_${via.y}`
  };
}
function convertPcbHoleToFootprint(hole) {
  if (hole.hole_shape === "round") hole.hole_shape = "circle";
  if (hole.hole_shape === "circle") {
    return {
      footprint: "MountingHole",
      layer: "F.Cu",
      uuid: hole.pcb_hole_id || generateUniqueId2(),
      at: { x: hole.x, y: hole.y },
      pads: [
        {
          type: "np_thru_hole",
          shape: "circle",
          at: [0, 0],
          size: [hole.hole_diameter, hole.hole_diameter],
          drill: hole.hole_diameter,
          layers: ["*.Cu", "*.Mask"],
          number: ""
        }
      ]
    };
  } else if (hole.hole_shape === "oval") {
    return {
      footprint: "MountingHole",
      layer: "F.Cu",
      uuid: hole.pcb_hole_id || generateUniqueId2(),
      at: { x: hole.x, y: hole.y },
      pads: [
        {
          type: "np_thru_hole",
          shape: "circle",
          at: [0, 0],
          size: [hole.hole_width, hole.hole_height],
          drill: hole.hole_width,
          layers: ["*.Cu", "*.Mask"],
          number: ""
        }
      ]
    };
  } else if (hole.hole_shape === "square") {
    return {
      footprint: "MountingHole",
      layer: "F.Cu",
      uuid: hole.pcb_hole_id || generateUniqueId2(),
      at: { x: hole.x, y: hole.y },
      pads: [
        {
          type: "np_thru_hole",
          shape: "rect",
          at: [0, 0],
          size: [hole.hole_diameter, hole.hole_diameter],
          drill: hole.hole_diameter,
          layers: ["*.Cu", "*.Mask"],
          number: ""
        }
      ]
    };
  }
  throw new Error(`Unknown hole shape: ${hole.hole_shape}`);
}
function convertPcbPlatedHoleToFootprint(platedHole, connMap) {
  const number = platedHole.port_hints?.find((ph) => ph.match(/^\d+$/)) || "";
  if (platedHole.shape === "circle") {
    return {
      footprint: "PlatedHole",
      layer: "F.Cu",
      // Assuming top layer, adjust if needed
      uuid: platedHole.pcb_plated_hole_id || generateUniqueId2(),
      at: { x: platedHole.x, y: platedHole.y },
      pads: [
        {
          type: "thru_hole",
          shape: platedHole.shape === "circle" ? "circle" : "rect",
          at: [0, 0],
          size: [platedHole.outer_diameter, platedHole.outer_diameter],
          drill: platedHole.hole_diameter,
          layers: platedHole.layers.map(
            (l) => mapTscircuitLayerToKicadLayer(l)
          ),
          net: netIdToNetRef(
            connMap.getNetConnectedToId(platedHole.pcb_plated_hole_id)
          ),
          number
        }
      ]
    };
  } else if (platedHole.shape === "oval" || platedHole.shape === "pill") {
    return {
      footprint: "PlatedHole",
      layer: "F.Cu",
      // Assuming top layer, adjust if needed
      uuid: platedHole.pcb_plated_hole_id || generateUniqueId2(),
      at: { x: platedHole.x, y: platedHole.y },
      pads: [
        {
          type: "thru_hole",
          shape: "oval",
          at: [0, 0],
          size: [platedHole.outer_width, platedHole.outer_height],
          drill: platedHole.hole_width,
          layers: platedHole.layers.map(
            (l) => mapTscircuitLayerToKicadLayer(l)
          ),
          net: netIdToNetRef(
            connMap.getNetConnectedToId(platedHole.pcb_plated_hole_id)
          ),
          number
        }
      ]
    };
  }
  throw new Error(`Unknown plated hole shape: ${platedHole.shape}`);
}
function generateUniqueId2() {
  return "id_" + Math.random().toString(36).substr(2, 9);
}
function convertPcbComponentToFootprint(component, allElements, connMap) {
  const footprint = {
    footprint: component.source_component_id,
    layer: component.layer === "top" ? "F.Cu" : "B.Cu",
    uuid: component.pcb_component_id,
    at: {
      x: component.center.x,
      y: component.center.y
      // We don't rotate because Circuit JSON coordinates are pre-rotated
      // rotation: component.rotation ? parseFloat(component.rotation) : 0,
    },
    pads: []
  };
  for (const elm of allElements) {
    if (elm.type === "pcb_smtpad" && elm.pcb_component_id === component.pcb_component_id) {
      const kicadPad = convertPcbSmtPadToPad(elm, component, connMap);
      if (kicadPad) footprint.pads?.push(kicadPad);
    }
  }
  return footprint;
}
function mapToKicadLayer(layer) {
  const CJ_LAYER_TO_KICAD_LAYER = {
    top: "F.Cu",
    bottom: "B.Cu"
  };
  return CJ_LAYER_TO_KICAD_LAYER[layer];
}
function convertPcbSmtPadToPad(pad, component, connMap) {
  if (pad.shape === "rect") {
    return {
      number: pad.port_hints?.find((ph) => ph.match(/^\d+$/)) || "",
      type: "smd",
      net: netIdToNetRef(connMap.getNetConnectedToId(pad.pcb_smtpad_id)),
      shape: "roundrect",
      at: [pad.x - component.center.x, pad.y - component.center.y],
      size: [pad.width, pad.height],
      layers: [mapToKicadLayer(pad.layer)].filter(Boolean)
    };
  }
  return null;
}
function netIdToNetRef(netId) {
  return {
    id: netIdToNumber(netId),
    name: netId
  };
}
function convertPcbTraceToSegments(trace, connMap) {
  const segments = [];
  const netId = netIdToNumber(
    connMap.getNetConnectedToId(trace.source_trace_id)
  );
  for (let i = 0; i < trace.route.length - 1; i++) {
    const start = trace.route[i];
    const end = trace.route[i + 1];
    segments.push({
      start: [start.x, start.y],
      end: [end.x, end.y],
      width: (
        // @ts-expect-error
        trace.route_thickness_mode === "constant" ? trace.route[0].width : 0.2
      ),
      // Default width if not constant
      // @ts-expect-error
      layer: start.layer === "top" ? "F.Cu" : "B.Cu",
      net: netId
    });
  }
  return segments;
}
function netIdToNumber(netId) {
  if (!netId) return 0;
  if (netId.startsWith("connectivity_net")) {
    return parseInt(netId.replace("connectivity_net", ""));
  }
  return 0;
}

// lib/kicad-pcb/convert-kicad-pcb-to-sexpr-string.ts
function convertKiCadPcbToSExprString(kicadPcb) {
  const lines = [];
  lines.push("(kicad_pcb");
  lines.push(`  (version ${kicadPcb.version})`);
  lines.push(`  (generator "${kicadPcb.generator}")`);
  lines.push(`  (generator_version "${kicadPcb.generator_version}")`);
  lines.push("  (general");
  lines.push(`    (thickness ${kicadPcb.general.thickness})`);
  lines.push(
    `    (legacy_teardrops ${kicadPcb.general.legacy_teardrops ? "yes" : "no"})`
  );
  lines.push("  )");
  lines.push(`  (paper "${kicadPcb.paper}")`);
  lines.push("  (layers");
  kicadPcb.layers.forEach((layer) => {
    lines.push(`    ${convertLayerToSExpr(layer)}`);
  });
  lines.push("  )");
  lines.push("  (setup");
  lines.push(
    `    (pad_to_mask_clearance ${kicadPcb.setup.pad_to_mask_clearance})`
  );
  lines.push(
    `    (allow_soldermask_bridges_in_footprints ${kicadPcb.setup.allow_soldermask_bridges_in_footprints ? "yes" : "no"})`
  );
  lines.push(`    (pcbplotparams`);
  lines.push(convertPcbPlotParamsToSExpr(kicadPcb.setup.pcbplotparams));
  lines.push("    )");
  lines.push("  )");
  kicadPcb.nets.forEach((net) => {
    lines.push(`  (net ${net.id} "${net.name}")`);
  });
  kicadPcb.footprints.forEach((footprint) => {
    lines.push(convertFootprintToSExpr(footprint));
  });
  kicadPcb.segments.forEach((segment) => {
    lines.push(convertSegmentToSExpr(segment));
  });
  kicadPcb.vias?.forEach((via) => {
    lines.push(convertViaToSExpr(via));
  });
  kicadPcb.gr_lines?.forEach((grLine) => {
    lines.push(convertGrLineToSExpr(grLine));
  });
  lines.push(")");
  return lines.join("\n");
}
function convertLayerToSExpr(layer) {
  return `(${layer.id} "${layer.name}" ${layer.type}${layer.description ? ` "${layer.description}"` : ""})`;
}
function convertPcbPlotParamsToSExpr(params) {
  const lines = [];
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "boolean") {
      lines.push(`      (${key} ${value ? "yes" : "no"})`);
    } else if (typeof value === "number") {
      lines.push(`      (${key} ${value})`);
    } else {
      lines.push(`      (${key} "${value}")`);
    }
  });
  return lines.join("\n");
}
function convertFootprintToSExpr(footprint) {
  const lines = [];
  lines.push(`  (footprint "${footprint.footprint}"`);
  lines.push(`    (layer "${footprint.layer}")`);
  lines.push(`    (uuid ${footprint.uuid})`);
  lines.push(
    `    (at ${footprint.at.x} ${footprint.at.y}${footprint.at.rotation ? ` ${footprint.at.rotation}` : ""})`
  );
  if (footprint.descr) lines.push(`    (descr "${footprint.descr}")`);
  if (footprint.tags) lines.push(`    (tags "${footprint.tags}")`);
  footprint.pads?.forEach((pad) => {
    lines.push(convertPadToSExpr(pad));
  });
  lines.push("  )");
  return lines.join("\n");
}
function convertPadToSExpr(pad) {
  const lines = [];
  lines.push(`    (pad "${pad.number}" ${pad.type} ${pad.shape}`);
  lines.push(`      (at ${pad.at[0]} ${pad.at[1]})`);
  lines.push(`      (size ${pad.size[0]} ${pad.size[1]})`);
  lines.push(`      (layers ${pad.layers.join(" ")})`);
  if (pad.net) {
    lines.push(`      (net ${pad.net.id} "${pad.net.name}")`);
  }
  if (pad.drill) {
    lines.push(`      (drill ${pad.drill})`);
  }
  lines.push("    )");
  return lines.join("\n");
}
function convertSegmentToSExpr(segment) {
  return `  (segment (start ${segment.start[0]} ${segment.start[1]}) (end ${segment.end[0]} ${segment.end[1]}) (width ${segment.width}) (layer "${segment.layer}") (net ${segment.net}))`;
}
function surroundWithQuotes(value) {
  return `"${value}"`;
}
function convertViaToSExpr(via) {
  return `  (via (at ${via.at[0]} ${via.at[1]}) (size ${via.size}) (drill ${via.drill}) (layers ${via.layers.map(surroundWithQuotes).join(" ")}) (net ${via.net})${via.uuid ? ` (uuid "${via.uuid}")` : ""})`;
}
function convertGrLineToSExpr(grLine) {
  return `  (gr_line (start ${grLine.start[0]} ${grLine.start[1]}) (end ${grLine.end[0]} ${grLine.end[1]}) (layer "${grLine.layer}") (width ${grLine.width}))`;
}

// lib/common/parse-sexpr.ts
function parseSExpr(input) {
  const tokens = tokenize(input);
  const [expr, _] = parseTokens(tokens);
  if (Array.isArray(expr) && expr.length === 1 && Array.isArray(expr[0])) {
    return expr[0];
  }
  return expr;
}
function tokenize(input) {
  const tokens = [];
  let current = "";
  let inString = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (inString) {
        tokens.push(current);
        current = "";
        inString = false;
      } else {
        inString = true;
      }
    } else if (inString) {
      current += char;
    } else if (/\s/.test(char)) {
      if (current !== "") {
        tokens.push(current);
        current = "";
      }
    } else if (char === "(" || char === ")") {
      if (current !== "") {
        tokens.push(current);
        current = "";
      }
      tokens.push(char);
    } else {
      current += char;
    }
  }
  if (current !== "") {
    tokens.push(current);
  }
  return tokens;
}
function parseTokens(tokens, index = 0) {
  const result = [];
  while (index < tokens.length) {
    const token = tokens[index];
    if (token === "(") {
      index += 1;
      const [expr, newIndex] = parseTokens(tokens, index);
      result.push(expr);
      index = newIndex;
    } else if (token === ")") {
      return [result, index + 1];
    } else {
      result.push(token);
      index += 1;
    }
  }
  return [result, index];
}

// lib/kicad-pcb/zod.ts
import { z } from "zod";
var yesnobool = z.union([z.literal("yes"), z.literal("no"), z.boolean()]).transform((v) => v === "yes" || v === true);
var GeneralSchema = z.object({
  thickness: z.number(),
  legacy_teardrops: yesnobool
});
var LayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional()
});
var PcbPlotParamsSchema = z.object({
  layerselection: z.string().optional(),
  plot_on_all_layers_selection: z.string(),
  disableapertmacros: yesnobool.optional(),
  usegerberextensions: yesnobool.optional(),
  usegerberattributes: yesnobool.optional(),
  usegerberadvancedattributes: yesnobool.optional(),
  creategerberjobfile: yesnobool.optional(),
  dashed_line_dash_ratio: z.number().optional(),
  dashed_line_gap_ratio: z.number().optional(),
  svgprecision: z.number(),
  plotframeref: yesnobool.optional(),
  viasonmask: yesnobool.optional(),
  mode: z.number().optional(),
  useauxorigin: yesnobool.optional(),
  hpglpennumber: z.number(),
  hpglpenspeed: z.number().optional(),
  hpglpendiameter: z.number().optional(),
  pdf_front_fp_property_popups: yesnobool.optional(),
  pdf_back_fp_property_popups: yesnobool.optional(),
  dxfpolygonmode: yesnobool.optional(),
  dxfimperialunits: yesnobool.optional(),
  dxfusepcbnewfont: yesnobool.optional(),
  psnegative: yesnobool.optional(),
  psa4output: yesnobool.optional(),
  plotreference: yesnobool.optional(),
  plotvalue: yesnobool.optional(),
  plotfptext: yesnobool.optional(),
  plotinvisibletext: yesnobool.optional(),
  sketchpadsonfab: yesnobool.optional(),
  subtractmaskfromsilk: yesnobool.optional(),
  outputformat: z.number().optional(),
  mirror: yesnobool.optional(),
  drillshape: z.number().optional(),
  scaleselection: z.number().optional(),
  outputdirectory: z.string().optional()
});
var SetupSchema = z.object({
  pad_to_mask_clearance: z.number(),
  allow_soldermask_bridges_in_footprints: yesnobool,
  pcbplotparams: PcbPlotParamsSchema
});
var NetSchema = z.object({
  id: z.number(),
  name: z.string()
});
var AtSchema = z.object({
  x: z.number(),
  y: z.number(),
  rotation: z.number().optional()
});
var FontSchema = z.object({
  size: z.tuple([z.number(), z.number()]),
  thickness: z.number()
});
var EffectsSchema = z.object({
  font: FontSchema.optional()
});
var PropertySchema = z.object({
  name: z.string(),
  value: z.string(),
  at: AtSchema.optional(),
  layer: z.string().optional(),
  uuid: z.string().optional(),
  unlocked: z.boolean().optional(),
  hide: z.boolean().optional(),
  effects: EffectsSchema.optional()
});
var StrokeSchema = z.object({
  width: z.number(),
  type: z.string()
});
var FpLineSchema = z.object({
  start: z.tuple([z.number(), z.number()]),
  end: z.tuple([z.number(), z.number()]),
  stroke: StrokeSchema,
  layer: z.string(),
  uuid: z.string().optional()
});
var FpTextSchema = z.object({
  type: z.string(),
  text: z.string(),
  at: AtSchema,
  layer: z.string(),
  uuid: z.string().optional(),
  effects: EffectsSchema.optional()
});
var NetReferenceSchema = z.object({
  id: z.number(),
  name: z.string().optional()
});
var PadSchema = z.object({
  number: z.string(),
  type: z.enum(["thru_hole", "np_thru_hole", "smd"]),
  shape: z.enum(["rect", "roundrect", "oval", "circle"]),
  drill: z.number().optional(),
  at: z.tuple([z.number(), z.number()]),
  size: z.tuple([z.number(), z.number()]),
  layers: z.array(z.string()),
  roundrect_rratio: z.number().optional(),
  net: NetReferenceSchema.optional(),
  pintype: z.string().optional(),
  uuid: z.string().optional()
});
var ModelSchema = z.object({
  path: z.string(),
  offset: z.object({
    xyz: z.tuple([z.number(), z.number(), z.number()])
  }).optional(),
  scale: z.object({
    xyz: z.tuple([z.number(), z.number(), z.number()])
  }).optional(),
  rotate: z.object({
    xyz: z.tuple([z.number(), z.number(), z.number()])
  }).optional()
});
var FootprintSchema = z.object({
  footprint: z.string(),
  layer: z.string(),
  uuid: z.string(),
  at: AtSchema,
  descr: z.string().optional(),
  tags: z.string().optional(),
  properties: z.array(PropertySchema).optional(),
  path: z.string().optional(),
  sheetname: z.string().optional(),
  sheetfile: z.string().optional(),
  attr: z.string().optional(),
  fp_lines: z.array(FpLineSchema).optional(),
  fp_texts: z.array(FpTextSchema).optional(),
  pads: z.array(PadSchema).optional(),
  model: ModelSchema.optional()
});
var GrRectSchema = z.object({
  start: z.tuple([z.number(), z.number()]),
  end: z.tuple([z.number(), z.number()]),
  stroke: StrokeSchema,
  fill: z.string(),
  layer: z.string(),
  uuid: z.string().optional()
});
var SegmentSchema = z.object({
  start: z.tuple([z.number(), z.number()]),
  end: z.tuple([z.number(), z.number()]),
  width: z.number(),
  layer: z.string(),
  net: z.number(),
  uuid: z.string().optional()
});
var ViaSchema = z.object({
  at: z.tuple([z.number(), z.number()]),
  size: z.number(),
  drill: z.number(),
  layers: z.array(z.string()),
  net: z.number(),
  uuid: z.string()
});
var KiCadPcbSchema = z.object({
  version: z.number(),
  generator: z.string(),
  generator_version: z.string(),
  general: GeneralSchema,
  paper: z.string(),
  layers: z.array(LayerSchema),
  setup: SetupSchema,
  nets: z.array(NetSchema),
  footprints: z.array(FootprintSchema),
  gr_rects: z.array(GrRectSchema),
  segments: z.array(SegmentSchema),
  vias: z.array(ViaSchema)
  // Add this line
});

// lib/kicad-pcb/parse-kicad-pcb-sexpr.ts
function parseKiCadPcb(sexpr) {
  if (typeof sexpr === "string") {
    sexpr = parseSExpr(sexpr);
  }
  if (!Array.isArray(sexpr)) {
    throw new Error("Invalid KiCad Pcb format");
  }
  if (sexpr[0] !== "kicad_pcb") {
    throw new Error("Not a KiCad Pcb file");
  }
  const pcb = {
    version: 0,
    generator: "",
    generator_version: "",
    general: { thickness: 0, legacy_teardrops: "no" },
    paper: "",
    layers: [],
    setup: {
      pad_to_mask_clearance: 0,
      allow_soldermask_bridges_in_footprints: "no",
      pcbplotparams: {}
    },
    nets: [],
    footprints: [],
    gr_rects: [],
    segments: [],
    vias: []
  };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "version":
        pcb.version = Number(elem[1]);
        break;
      case "generator":
        pcb.generator = elem[1];
        break;
      case "generator_version":
        pcb.generator_version = elem[1];
        break;
      case "general":
        pcb.general = parseGeneral(elem);
        break;
      case "paper":
        pcb.paper = elem[1];
        break;
      case "layers":
        pcb.layers = parseLayers(elem);
        break;
      case "setup":
        pcb.setup = parseSetup(elem);
        break;
      case "net":
        pcb.nets.push(parseNet(elem));
        break;
      case "footprint":
        pcb.footprints.push(parseFootprint(elem));
        break;
      case "gr_rect":
        pcb.gr_rects.push(parseGrRect(elem));
        break;
      case "segment":
        pcb.segments.push(parseSegment(elem));
        break;
      case "via":
        pcb.vias.push(parseVia(elem));
        break;
      default:
        break;
    }
  }
  return KiCadPcbSchema.parse(pcb);
}
function parseGeneral(sexpr) {
  const general = { thickness: 0, legacy_teardrops: "no" };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "thickness":
        general.thickness = Number(elem[1]);
        break;
      case "legacy_teardrops":
        general.legacy_teardrops = elem[1];
        break;
      default:
        break;
    }
  }
  return general;
}
function parseLayers(sexpr) {
  const layers = [];
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const id = Number(elem[0]);
    const name = elem[1];
    const type = elem[2];
    const description = elem[3];
    layers.push({ id, name, type, description });
  }
  return layers;
}
function parseSetup(sexpr) {
  const setup = {
    pad_to_mask_clearance: 0,
    allow_soldermask_bridges_in_footprints: "no",
    pcbplotparams: {}
  };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    if (key === "pad_to_mask_clearance") {
      setup.pad_to_mask_clearance = Number(elem[1]);
    } else if (key === "allow_soldermask_bridges_in_footprints") {
      setup.allow_soldermask_bridges_in_footprints = elem[1];
    } else if (key === "pcbplotparams") {
      setup.pcbplotparams = parsePcbPlotParams(elem);
    }
  }
  return setup;
}
function parsePcbPlotParams(sexpr) {
  const params = {};
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    const value = elem[1];
    if (value === "yes" || value === "no") {
      params[key] = value;
    } else if (/^-?\d+\.?\d*$/.test(value)) {
      params[key] = Number(value);
    } else {
      params[key] = value;
    }
  }
  return params;
}
function parseNet(sexpr) {
  const id = Number(sexpr[1]);
  const name = sexpr[2];
  return { id, name };
}
function parseFootprint(sexpr) {
  const footprint = {
    footprint: "",
    layer: "",
    uuid: "",
    at: { x: 0, y: 0 },
    properties: [],
    fp_lines: [],
    fp_texts: [],
    pads: []
  };
  footprint.footprint = sexpr[1];
  for (let i = 2; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "layer":
        footprint.layer = elem[1];
        break;
      case "uuid":
        footprint.uuid = elem[1];
        break;
      case "at":
        footprint.at = parseAt(elem);
        break;
      case "descr":
        footprint.descr = elem[1];
        break;
      case "tags":
        footprint.tags = elem[1];
        break;
      case "property":
        footprint.properties.push(parseProperty(elem));
        break;
      case "fp_line":
        footprint.fp_lines.push(parseFpLine(elem));
        break;
      case "fp_text":
        footprint.fp_texts.push(parseFpText(elem));
        break;
      case "pad":
        footprint.pads.push(parsePad(elem));
        break;
      case "model":
        footprint.model = parseModel(elem);
        break;
      case "path":
        footprint.path = elem[1];
        break;
      case "sheetname":
        footprint.sheetname = elem[1];
        break;
      case "sheetfile":
        footprint.sheetfile = elem[1];
        break;
      case "attr":
        footprint.attr = elem[1];
        break;
      default:
        console.log(`Warning: Unhandled key in footprint: ${key}`);
        break;
    }
  }
  return footprint;
}
function parseAt(sexpr) {
  const x = Number(sexpr[1]);
  const y = Number(sexpr[2]);
  const rotation2 = sexpr.length > 3 ? Number(sexpr[3]) : void 0;
  return { x, y, rotation: rotation2 };
}
function parseProperty(sexpr) {
  const name = sexpr[1];
  const value = sexpr[2];
  const property = { name, value };
  for (let i = 3; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "at":
        property.at = parseAt(elem);
        break;
      case "layer":
        property.layer = elem[1];
        break;
      case "uuid":
        property.uuid = elem[1];
        break;
      case "unlocked":
        property.unlocked = elem[1] === "yes";
        break;
      case "hide":
        property.hide = elem[1] === "yes";
        break;
      case "effects":
        property.effects = parseEffects(elem);
        break;
      default:
        break;
    }
  }
  return property;
}
function parseEffects(sexpr) {
  const effects = {};
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    if (key === "font") {
      effects.font = parseFont(elem);
    }
  }
  return effects;
}
function parseFont(sexpr) {
  const font = { size: [0, 0], thickness: 0 };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    if (key === "size") {
      font.size = [Number(elem[1]), Number(elem[2])];
    } else if (key === "thickness") {
      font.thickness = Number(elem[1]);
    }
  }
  return font;
}
function parseFpLine(sexpr) {
  const fp_line = {
    start: [0, 0],
    end: [0, 0],
    stroke: { width: 0, type: "" },
    layer: ""
  };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "start":
        fp_line.start = [Number(elem[1]), Number(elem[2])];
        break;
      case "end":
        fp_line.end = [Number(elem[1]), Number(elem[2])];
        break;
      case "stroke":
        fp_line.stroke = parseStroke(elem);
        break;
      case "layer":
        fp_line.layer = elem[1];
        break;
      case "uuid":
        fp_line.uuid = elem[1];
        break;
      default:
        break;
    }
  }
  return fp_line;
}
function parseStroke(sexpr) {
  const stroke = { width: 0, type: "" };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    if (key === "width") {
      stroke.width = Number(elem[1]);
    } else if (key === "type") {
      stroke.type = elem[1];
    }
  }
  return stroke;
}
function parseFpText(sexpr) {
  const fp_text = { type: "", text: "", at: { x: 0, y: 0 }, layer: "" };
  fp_text.type = sexpr[1];
  fp_text.text = sexpr[2];
  for (let i = 3; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "at":
        fp_text.at = parseAt(elem);
        break;
      case "layer":
        fp_text.layer = elem[1];
        break;
      case "uuid":
        fp_text.uuid = elem[1];
        break;
      case "effects":
        fp_text.effects = parseEffects(elem);
        break;
      default:
        break;
    }
  }
  return fp_text;
}
function parsePad(sexpr) {
  const pad = {
    number: "",
    type: "",
    // @ts-ignore
    shape: "",
    at: [0, 0],
    size: [0, 0],
    layers: []
  };
  pad.number = sexpr[1];
  pad.type = sexpr[2];
  pad.shape = sexpr[3];
  for (let i = 4; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "drill":
        pad.drill = Number(elem[1]);
        break;
      case "at":
        pad.at = [Number(elem[1]), Number(elem[2])];
        break;
      case "size":
        pad.size = [Number(elem[1]), Number(elem[2])];
        break;
      case "layers":
        pad.layers = elem.slice(1);
        break;
      case "roundrect_rratio":
        pad.roundrect_rratio = Number(elem[1]);
        break;
      case "net":
        pad.net = { id: Number(elem[1]), name: elem[2] };
        break;
      case "pintype":
        pad.pintype = elem[1];
        break;
      case "uuid":
        pad.uuid = elem[1];
        break;
      default:
        break;
    }
  }
  return pad;
}
function parseModel(sexpr) {
  const model = { path: "" };
  model.path = sexpr[1];
  for (let i = 2; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "offset":
        model.offset = parseXYZ(elem);
        break;
      case "scale":
        model.scale = parseXYZ(elem);
        break;
      case "rotate":
        model.rotate = parseXYZ(elem);
        break;
      default:
        break;
    }
  }
  return model;
}
function parseXYZ(sexpr) {
  const xyzElem = sexpr.find((e) => Array.isArray(e) && e[0] === "xyz");
  if (xyzElem && Array.isArray(xyzElem)) {
    return {
      xyz: [Number(xyzElem[1]), Number(xyzElem[2]), Number(xyzElem[3])]
    };
  }
  return { xyz: [0, 0, 0] };
}
function parseGrRect(sexpr) {
  const gr_rect = {
    start: [0, 0],
    end: [0, 0],
    stroke: { width: 0, type: "" },
    fill: "",
    layer: ""
  };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "start":
        gr_rect.start = [Number(elem[1]), Number(elem[2])];
        break;
      case "end":
        gr_rect.end = [Number(elem[1]), Number(elem[2])];
        break;
      case "stroke":
        gr_rect.stroke = parseStroke(elem);
        break;
      case "fill":
        gr_rect.fill = elem[1];
        break;
      case "layer":
        gr_rect.layer = elem[1];
        break;
      case "uuid":
        gr_rect.uuid = elem[1];
        break;
      default:
        break;
    }
  }
  return gr_rect;
}
function parseSegment(sexpr) {
  const segment = {
    start: [0, 0],
    end: [0, 0],
    width: 0,
    layer: "",
    net: 0
  };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "start":
        segment.start = [Number(elem[1]), Number(elem[2])];
        break;
      case "end":
        segment.end = [Number(elem[1]), Number(elem[2])];
        break;
      case "width":
        segment.width = Number(elem[1]);
        break;
      case "layer":
        segment.layer = elem[1];
        break;
      case "net":
        segment.net = Number(elem[1]);
        break;
      case "uuid":
        segment.uuid = elem[1];
        break;
      default:
        break;
    }
  }
  return segment;
}
function parseVia(sexpr) {
  const via = {
    at: [0, 0],
    size: 0,
    drill: 0,
    layers: [],
    net: 0,
    uuid: ""
  };
  for (let i = 1; i < sexpr.length; i++) {
    const elem = sexpr[i];
    if (!Array.isArray(elem)) continue;
    const key = elem[0];
    switch (key) {
      case "at":
        via.at = [Number(elem[1]), Number(elem[2])];
        break;
      case "size":
        via.size = Number(elem[1]);
        break;
      case "drill":
        via.drill = Number(elem[1]);
        break;
      case "layers":
        via.layers = elem.slice(1);
        break;
      case "net":
        via.net = Number(elem[1]);
        break;
      case "uuid":
        via.uuid = elem[1];
        break;
      default:
        break;
    }
  }
  return via;
}

// lib/kicad-pro/convert-circuit-json-to-kicad-pro.ts
function convertCircuitJsonToKicadPro(circuitJson) {
  const projectName = "testkicadproject";
  const dsnFilePath = "";
  return {
    board: {
      "3dviewports": [],
      design_settings: {
        defaults: {
          apply_defaults_to_fp_fields: false,
          apply_defaults_to_fp_shapes: false,
          apply_defaults_to_fp_text: false,
          board_outline_line_width: 0.05,
          copper_line_width: 0.2,
          copper_text_italic: false,
          copper_text_size_h: 1.5,
          copper_text_size_v: 1.5,
          copper_text_thickness: 0.3,
          copper_text_upright: false,
          courtyard_line_width: 0.05,
          dimension_precision: 4,
          dimension_units: 3,
          dimensions: {
            arrow_length: 127e4,
            extension_offset: 5e5,
            keep_text_aligned: true,
            suppress_zeroes: false,
            text_position: 0,
            units_format: 1
          },
          fab_line_width: 0.1,
          fab_text_italic: false,
          fab_text_size_h: 1,
          fab_text_size_v: 1,
          fab_text_thickness: 0.15,
          fab_text_upright: false,
          other_line_width: 0.1,
          other_text_italic: false,
          other_text_size_h: 1,
          other_text_size_v: 1,
          other_text_thickness: 0.15,
          other_text_upright: false,
          pads: {
            drill: 0.762,
            height: 1.524,
            width: 1.524
          },
          silk_line_width: 0.1,
          silk_text_italic: false,
          silk_text_size_h: 1,
          silk_text_size_v: 1,
          silk_text_thickness: 0.1,
          silk_text_upright: false,
          zones: {
            min_clearance: 0.5
          }
        },
        diff_pair_dimensions: [],
        drc_exclusions: [],
        meta: {
          version: 2
        },
        rule_severities: {
          annular_width: "error",
          clearance: "error",
          connection_width: "warning",
          copper_edge_clearance: "error",
          copper_sliver: "warning",
          courtyards_overlap: "error",
          diff_pair_gap_out_of_range: "error",
          diff_pair_uncoupled_length_too_long: "error",
          drill_out_of_range: "error",
          duplicate_footprints: "warning",
          extra_footprint: "warning",
          footprint: "error",
          footprint_symbol_mismatch: "warning",
          footprint_type_mismatch: "ignore",
          hole_clearance: "error",
          hole_near_hole: "error",
          holes_co_located: "warning",
          invalid_outline: "error",
          isolated_copper: "warning",
          item_on_disabled_layer: "error",
          items_not_allowed: "error",
          length_out_of_range: "error",
          lib_footprint_issues: "warning",
          lib_footprint_mismatch: "warning",
          malformed_courtyard: "error",
          microvia_drill_out_of_range: "error",
          missing_courtyard: "ignore",
          missing_footprint: "warning",
          net_conflict: "warning",
          npth_inside_courtyard: "ignore",
          padstack: "warning",
          pth_inside_courtyard: "ignore",
          shorting_items: "error",
          silk_edge_clearance: "warning",
          silk_over_copper: "warning",
          silk_overlap: "warning",
          skew_out_of_range: "error",
          solder_mask_bridge: "error",
          starved_thermal: "error",
          text_height: "warning",
          text_thickness: "warning",
          through_hole_pad_without_hole: "error",
          too_many_vias: "error",
          track_dangling: "warning",
          track_width: "error",
          tracks_crossing: "error",
          unconnected_items: "error",
          unresolved_variable: "error",
          via_dangling: "warning",
          zones_intersect: "error"
        },
        rules: {
          max_error: 5e-3,
          min_clearance: 0,
          min_connection: 0,
          min_copper_edge_clearance: 0.5,
          min_hole_clearance: 0.25,
          min_hole_to_hole: 0.25,
          min_microvia_diameter: 0.2,
          min_microvia_drill: 0.1,
          min_resolved_spokes: 2,
          min_silk_clearance: 0,
          min_text_height: 0.8,
          min_text_thickness: 0.08,
          min_through_hole_diameter: 0.3,
          min_track_width: 0,
          min_via_annular_width: 0.1,
          min_via_diameter: 0.5,
          solder_mask_to_copper_clearance: 0,
          use_height_for_length_calcs: true
        },
        teardrop_options: [
          {
            td_onpadsmd: true,
            td_onroundshapesonly: false,
            td_ontrackend: false,
            td_onviapad: true
          }
        ],
        teardrop_parameters: [
          {
            td_allow_use_two_tracks: true,
            td_curve_segcount: 0,
            td_height_ratio: 1,
            td_length_ratio: 0.5,
            td_maxheight: 2,
            td_maxlen: 1,
            td_on_pad_in_zone: false,
            td_target_name: "td_round_shape",
            td_width_to_size_filter_ratio: 0.9
          },
          {
            td_allow_use_two_tracks: true,
            td_curve_segcount: 0,
            td_height_ratio: 1,
            td_length_ratio: 0.5,
            td_maxheight: 2,
            td_maxlen: 1,
            td_on_pad_in_zone: false,
            td_target_name: "td_rect_shape",
            td_width_to_size_filter_ratio: 0.9
          },
          {
            td_allow_use_two_tracks: true,
            td_curve_segcount: 0,
            td_height_ratio: 1,
            td_length_ratio: 0.5,
            td_maxheight: 2,
            td_maxlen: 1,
            td_on_pad_in_zone: false,
            td_target_name: "td_track_end",
            td_width_to_size_filter_ratio: 0.9
          }
        ],
        track_widths: [],
        tuning_pattern_settings: {
          diff_pair_defaults: {
            corner_radius_percentage: 80,
            corner_style: 1,
            max_amplitude: 1,
            min_amplitude: 0.2,
            single_sided: false,
            spacing: 1
          },
          diff_pair_skew_defaults: {
            corner_radius_percentage: 80,
            corner_style: 1,
            max_amplitude: 1,
            min_amplitude: 0.2,
            single_sided: false,
            spacing: 0.6
          },
          single_track_defaults: {
            corner_radius_percentage: 80,
            corner_style: 1,
            max_amplitude: 1,
            min_amplitude: 0.2,
            single_sided: false,
            spacing: 0.6
          }
        },
        via_dimensions: [],
        zones_allow_external_fillets: false
      },
      ipc2581: {
        dist: "",
        distpn: "",
        internal_id: "",
        mfg: "",
        mpn: ""
      },
      layer_presets: [],
      viewports: []
    },
    boards: [],
    cvpcb: {
      equivalence_files: []
    },
    erc: {
      erc_exclusions: [],
      meta: {
        version: 0
      },
      pin_map: [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [0, 2, 0, 1, 0, 0, 1, 0, 2, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 2],
        [0, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 2],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2],
        [0, 2, 1, 2, 0, 0, 1, 0, 2, 2, 2, 2],
        [0, 2, 0, 1, 0, 0, 1, 0, 2, 0, 0, 2],
        [0, 2, 1, 1, 0, 0, 1, 0, 2, 0, 0, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
      ],
      rule_severities: {
        bus_definition_conflict: "error",
        bus_entry_needed: "error",
        bus_to_bus_conflict: "error",
        bus_to_net_conflict: "error",
        conflicting_netclasses: "error",
        different_unit_footprint: "error",
        different_unit_net: "error",
        duplicate_reference: "error",
        duplicate_sheet_names: "error",
        endpoint_off_grid: "warning",
        extra_units: "error",
        global_label_dangling: "warning",
        hier_label_mismatch: "error",
        label_dangling: "error",
        lib_symbol_issues: "warning",
        missing_bidi_pin: "warning",
        missing_input_pin: "warning",
        missing_power_pin: "error",
        missing_unit: "warning",
        multiple_net_names: "warning",
        net_not_bus_member: "warning",
        no_connect_connected: "warning",
        no_connect_dangling: "warning",
        pin_not_connected: "error",
        pin_not_driven: "error",
        pin_to_pin: "warning",
        power_pin_not_driven: "error",
        similar_labels: "warning",
        simulation_model_issue: "ignore",
        unannotated: "error",
        unit_value_mismatch: "error",
        unresolved_variable: "error",
        wire_dangling: "error"
      }
    },
    libraries: {
      pinned_footprint_libs: [],
      pinned_symbol_libs: []
    },
    meta: {
      filename: `${projectName}.kicad_pro`,
      version: 1
    },
    net_settings: {
      classes: [
        {
          bus_width: 12,
          clearance: 0.2,
          diff_pair_gap: 0.25,
          diff_pair_via_gap: 0.25,
          diff_pair_width: 0.2,
          line_style: 0,
          microvia_diameter: 0.3,
          microvia_drill: 0.1,
          name: "Default",
          pcb_color: "rgba(0, 0, 0, 0.000)",
          schematic_color: "rgba(0, 0, 0, 0.000)",
          track_width: 0.2,
          via_diameter: 0.6,
          via_drill: 0.3,
          wire_width: 6
        }
      ],
      meta: {
        version: 3
      },
      net_colors: null,
      netclass_assignments: null,
      netclass_patterns: []
    },
    pcbnew: {
      last_paths: {
        gencad: "",
        idf: "",
        netlist: "",
        plot: "",
        pos_files: "",
        specctra_dsn: dsnFilePath,
        step: "",
        svg: "",
        vrml: ""
      },
      page_layout_descr_file: ""
    },
    schematic: {
      annotate_start_num: 0,
      bom_export_filename: "",
      bom_fmt_presets: [],
      bom_fmt_settings: {
        field_delimiter: ",",
        keep_line_breaks: false,
        keep_tabs: false,
        name: "CSV",
        ref_delimiter: ",",
        ref_range_delimiter: "",
        string_delimiter: '"'
      },
      bom_presets: [],
      bom_settings: {
        exclude_dnp: false,
        fields_ordered: [
          {
            group_by: false,
            label: "Reference",
            name: "Reference",
            show: true
          },
          {
            group_by: true,
            label: "Value",
            name: "Value",
            show: true
          },
          {
            group_by: false,
            label: "Datasheet",
            name: "Datasheet",
            show: true
          },
          {
            group_by: false,
            label: "Footprint",
            name: "Footprint",
            show: true
          },
          {
            group_by: false,
            label: "Qty",
            name: "${QUANTITY}",
            show: true
          },
          {
            group_by: true,
            label: "DNP",
            name: "${DNP}",
            show: true
          }
        ],
        filter_string: "",
        group_symbols: true,
        name: "Grouped By Value",
        sort_asc: true,
        sort_field: "Reference"
      },
      connection_grid_size: 50,
      drawing: {
        dashed_lines_dash_length_ratio: 12,
        dashed_lines_gap_length_ratio: 3,
        default_line_thickness: 6,
        default_text_size: 50,
        field_names: [],
        intersheets_ref_own_page: false,
        intersheets_ref_prefix: "",
        intersheets_ref_short: false,
        intersheets_ref_show: false,
        intersheets_ref_suffix: "",
        junction_size_choice: 3,
        label_size_ratio: 0.375,
        operating_point_overlay_i_precision: 3,
        operating_point_overlay_i_range: "~A",
        operating_point_overlay_v_precision: 3,
        operating_point_overlay_v_range: "~V",
        overbar_offset_ratio: 1.23,
        pin_symbol_size: 25,
        text_offset_ratio: 0.15
      },
      legacy_lib_dir: "",
      legacy_lib_list: [],
      meta: {
        version: 1
      },
      net_format_name: "",
      page_layout_descr_file: "",
      plot_directory: "",
      spice_current_sheet_as_root: false,
      spice_external_command: 'spice "%I"',
      spice_model_current_sheet_as_root: true,
      spice_save_all_currents: false,
      spice_save_all_dissipations: false,
      spice_save_all_voltages: false,
      subpart_first_id: 65,
      subpart_id_separator: 0
    },
    sheets: [["9d9f6711-da5d-46c6-b577-ae6e721f0f67", "Root"]],
    text_variables: {}
  };
}

// lib/kicad-pro/zod.ts
import { z as z2 } from "zod";
var DimensionsSchema = z2.object({
  arrow_length: z2.number(),
  extension_offset: z2.number(),
  keep_text_aligned: z2.boolean(),
  suppress_zeroes: z2.boolean(),
  text_position: z2.number(),
  units_format: z2.number()
});
var PadsSchema = z2.object({
  drill: z2.number(),
  height: z2.number(),
  width: z2.number()
});
var ZonesSchema = z2.object({
  min_clearance: z2.number()
});
var RulesSchema = z2.object({
  max_error: z2.number(),
  min_clearance: z2.number(),
  min_connection: z2.number(),
  min_copper_edge_clearance: z2.number(),
  min_hole_clearance: z2.number(),
  min_hole_to_hole: z2.number(),
  min_microvia_diameter: z2.number(),
  min_microvia_drill: z2.number(),
  min_resolved_spokes: z2.number(),
  min_silk_clearance: z2.number(),
  min_text_height: z2.number(),
  min_text_thickness: z2.number(),
  min_through_hole_diameter: z2.number(),
  min_track_width: z2.number(),
  min_via_annular_width: z2.number(),
  min_via_diameter: z2.number(),
  solder_mask_to_copper_clearance: z2.number(),
  use_height_for_length_calcs: z2.boolean()
});
var TeardropOptionSchema = z2.object({
  td_onpadsmd: z2.boolean(),
  td_onroundshapesonly: z2.boolean(),
  td_ontrackend: z2.boolean(),
  td_onviapad: z2.boolean()
});
var TeardropParameterSchema = z2.object({
  td_allow_use_two_tracks: z2.boolean(),
  td_curve_segcount: z2.number(),
  td_height_ratio: z2.number(),
  td_length_ratio: z2.number(),
  td_maxheight: z2.number(),
  td_maxlen: z2.number(),
  td_on_pad_in_zone: z2.boolean(),
  td_target_name: z2.string(),
  td_width_to_size_filter_ratio: z2.number()
});
var TuningPatternDefaultsSchema = z2.object({
  corner_radius_percentage: z2.number(),
  corner_style: z2.number(),
  max_amplitude: z2.number(),
  min_amplitude: z2.number(),
  single_sided: z2.boolean(),
  spacing: z2.number()
});
var TuningPatternSettingsSchema = z2.object({
  diff_pair_defaults: TuningPatternDefaultsSchema,
  diff_pair_skew_defaults: TuningPatternDefaultsSchema,
  single_track_defaults: TuningPatternDefaultsSchema
});
var Ipc2581Schema = z2.object({
  dist: z2.string(),
  distpn: z2.string(),
  internal_id: z2.string(),
  mfg: z2.string(),
  mpn: z2.string()
});
var CvPcbSchema = z2.object({
  equivalence_files: z2.array(z2.any())
});
var ErcSchema = z2.object({
  erc_exclusions: z2.array(z2.any()),
  meta: z2.object({ version: z2.number() }),
  pin_map: z2.array(z2.array(z2.number())),
  rule_severities: z2.record(z2.string(), z2.string())
});
var LibrariesSchema = z2.object({
  pinned_footprint_libs: z2.array(z2.any()),
  pinned_symbol_libs: z2.array(z2.any())
});
var MetaSchema = z2.object({
  filename: z2.string(),
  version: z2.number()
});
var NetClassSchema = z2.object({
  bus_width: z2.number(),
  clearance: z2.number(),
  diff_pair_gap: z2.number(),
  diff_pair_via_gap: z2.number(),
  diff_pair_width: z2.number(),
  line_style: z2.number(),
  microvia_diameter: z2.number(),
  microvia_drill: z2.number(),
  name: z2.string(),
  pcb_color: z2.string(),
  schematic_color: z2.string(),
  track_width: z2.number(),
  via_diameter: z2.number(),
  via_drill: z2.number(),
  wire_width: z2.number()
});
var NetSettingsSchema = z2.object({
  classes: z2.array(NetClassSchema),
  meta: z2.object({ version: z2.number() }),
  net_colors: z2.any(),
  netclass_assignments: z2.any(),
  netclass_patterns: z2.array(z2.any())
});
var LastPathsSchema = z2.object({
  gencad: z2.string(),
  idf: z2.string(),
  netlist: z2.string(),
  plot: z2.string(),
  pos_files: z2.string(),
  specctra_dsn: z2.string(),
  step: z2.string(),
  svg: z2.string(),
  vrml: z2.string()
});
var PcbNewSchema = z2.object({
  last_paths: LastPathsSchema,
  page_layout_descr_file: z2.string()
});
var BomFormatSettingsSchema = z2.object({
  field_delimiter: z2.string(),
  keep_line_breaks: z2.boolean(),
  keep_tabs: z2.boolean(),
  name: z2.string(),
  ref_delimiter: z2.string(),
  ref_range_delimiter: z2.string(),
  string_delimiter: z2.string()
});
var BomFieldSchema = z2.object({
  group_by: z2.boolean(),
  label: z2.string(),
  name: z2.string(),
  show: z2.boolean()
});
var BomSettingsSchema = z2.object({
  exclude_dnp: z2.boolean(),
  fields_ordered: z2.array(BomFieldSchema),
  filter_string: z2.string(),
  group_symbols: z2.boolean(),
  name: z2.string(),
  sort_asc: z2.boolean(),
  sort_field: z2.string()
});
var DrawingSchema = z2.object({
  dashed_lines_dash_length_ratio: z2.number(),
  dashed_lines_gap_length_ratio: z2.number(),
  default_line_thickness: z2.number(),
  default_text_size: z2.number(),
  field_names: z2.array(z2.any()),
  intersheets_ref_own_page: z2.boolean(),
  intersheets_ref_prefix: z2.string(),
  intersheets_ref_short: z2.boolean(),
  intersheets_ref_show: z2.boolean(),
  intersheets_ref_suffix: z2.string(),
  junction_size_choice: z2.number(),
  label_size_ratio: z2.number(),
  operating_point_overlay_i_precision: z2.number(),
  operating_point_overlay_i_range: z2.string(),
  operating_point_overlay_v_precision: z2.number(),
  operating_point_overlay_v_range: z2.string(),
  overbar_offset_ratio: z2.number(),
  pin_symbol_size: z2.number(),
  text_offset_ratio: z2.number()
});
var SchematicSchema = z2.object({
  annotate_start_num: z2.number(),
  bom_export_filename: z2.string(),
  bom_fmt_presets: z2.array(z2.any()),
  bom_fmt_settings: BomFormatSettingsSchema,
  bom_presets: z2.array(z2.any()),
  bom_settings: BomSettingsSchema,
  connection_grid_size: z2.number(),
  drawing: DrawingSchema,
  legacy_lib_dir: z2.string(),
  legacy_lib_list: z2.array(z2.any()),
  meta: z2.object({ version: z2.number() }),
  net_format_name: z2.string(),
  page_layout_descr_file: z2.string(),
  plot_directory: z2.string(),
  spice_current_sheet_as_root: z2.boolean(),
  spice_external_command: z2.string(),
  spice_model_current_sheet_as_root: z2.boolean(),
  spice_save_all_currents: z2.boolean(),
  spice_save_all_dissipations: z2.boolean(),
  spice_save_all_voltages: z2.boolean(),
  subpart_first_id: z2.number(),
  subpart_id_separator: z2.number()
});
var DefaultsSchema = z2.object({
  apply_defaults_to_fp_fields: z2.boolean(),
  apply_defaults_to_fp_shapes: z2.boolean(),
  apply_defaults_to_fp_text: z2.boolean(),
  board_outline_line_width: z2.number(),
  copper_line_width: z2.number(),
  copper_text_italic: z2.boolean(),
  copper_text_size_h: z2.number(),
  copper_text_size_v: z2.number(),
  copper_text_thickness: z2.number(),
  copper_text_upright: z2.boolean(),
  courtyard_line_width: z2.number(),
  dimension_precision: z2.number(),
  dimension_units: z2.number(),
  dimensions: DimensionsSchema,
  fab_line_width: z2.number(),
  fab_text_italic: z2.boolean(),
  fab_text_size_h: z2.number(),
  fab_text_size_v: z2.number(),
  fab_text_thickness: z2.number(),
  fab_text_upright: z2.boolean(),
  other_line_width: z2.number(),
  other_text_italic: z2.boolean(),
  other_text_size_h: z2.number(),
  other_text_size_v: z2.number(),
  other_text_thickness: z2.number(),
  other_text_upright: z2.boolean(),
  pads: PadsSchema,
  silk_line_width: z2.number(),
  silk_text_italic: z2.boolean(),
  silk_text_size_h: z2.number(),
  silk_text_size_v: z2.number(),
  silk_text_thickness: z2.number(),
  silk_text_upright: z2.boolean(),
  zones: ZonesSchema
});
var DesignSettingsSchema = z2.object({
  defaults: DefaultsSchema,
  diff_pair_dimensions: z2.array(z2.any()),
  drc_exclusions: z2.array(z2.any()),
  meta: z2.object({ version: z2.number() }),
  rule_severities: z2.record(z2.string(), z2.string()),
  rules: RulesSchema,
  teardrop_options: z2.array(TeardropOptionSchema),
  teardrop_parameters: z2.array(TeardropParameterSchema),
  track_widths: z2.array(z2.any()),
  tuning_pattern_settings: TuningPatternSettingsSchema,
  via_dimensions: z2.array(z2.any()),
  zones_allow_external_fillets: z2.boolean()
});
var BoardSchema = z2.object({
  "3dviewports": z2.array(z2.any()),
  design_settings: DesignSettingsSchema,
  ipc2581: Ipc2581Schema,
  layer_presets: z2.array(z2.any()),
  viewports: z2.array(z2.any())
});
var KicadProjectSchema = z2.object({
  board: BoardSchema,
  boards: z2.array(z2.any()),
  cvpcb: CvPcbSchema,
  erc: ErcSchema,
  libraries: LibrariesSchema,
  meta: MetaSchema,
  net_settings: NetSettingsSchema,
  pcbnew: PcbNewSchema,
  schematic: SchematicSchema,
  sheets: z2.array(z2.tuple([z2.string(), z2.string()])),
  text_variables: z2.any()
});

// lib/kicad-sch/types.ts
var types_exports = {};

// lib/kicad-sch/zod.ts
var zod_exports = {};
__export(zod_exports, {
  AtSchema: () => AtSchema2,
  EffectsSchema: () => EffectsSchema2,
  FillSchema: () => FillSchema,
  FontSchema: () => FontSchema2,
  InstancesSchema: () => InstancesSchema,
  KicadSchSchema: () => KicadSchSchema,
  LibSymbolsSchema: () => LibSymbolsSchema,
  PathInstanceSchema: () => PathInstanceSchema,
  PinNameSchema: () => PinNameSchema,
  PinNamesSchema: () => PinNamesSchema,
  PinNumberSchema: () => PinNumberSchema,
  PinNumbersSchema: () => PinNumbersSchema,
  PinSchema: () => PinSchema,
  PointSchema: () => PointSchema,
  PolylineSchema: () => PolylineSchema,
  ProjectInstanceSchema: () => ProjectInstanceSchema,
  PropertySchema: () => PropertySchema2,
  RectangleSchema: () => RectangleSchema,
  SheetInstancesSchema: () => SheetInstancesSchema,
  SheetPathSchema: () => SheetPathSchema,
  StrokeSchema: () => StrokeSchema2,
  SubSymbolSchema: () => SubSymbolSchema,
  SymbolDefinitionSchema: () => SymbolDefinitionSchema,
  SymbolInstanceSchema: () => SymbolInstanceSchema,
  SymbolPinSchema: () => SymbolPinSchema,
  WireSchema: () => WireSchema,
  YesNoSchema: () => YesNo
});
import { z as z3 } from "zod";
var YesNo = z3.enum(["yes", "no"]);
var PointSchema = z3.object({
  x: z3.number(),
  y: z3.number()
});
var AtSchema2 = z3.object({
  x: z3.number(),
  y: z3.number(),
  rotation: z3.number().optional()
});
var FontSchema2 = z3.object({
  size: z3.tuple([z3.number(), z3.number()])
});
var EffectsSchema2 = z3.object({
  font: FontSchema2.optional(),
  justify: z3.string().optional(),
  hide: z3.boolean().optional()
});
var PinNameSchema = z3.object({
  name: z3.string(),
  effects: EffectsSchema2.optional()
});
var PinNumberSchema = z3.object({
  number: z3.string(),
  effects: EffectsSchema2.optional()
});
var StrokeSchema2 = z3.object({
  width: z3.number(),
  type: z3.string().optional()
});
var FillSchema = z3.object({
  type: z3.string()
});
var PolylineSchema = z3.object({
  pts: z3.array(PointSchema),
  stroke: StrokeSchema2,
  fill: FillSchema
});
var RectangleSchema = z3.object({
  start: PointSchema,
  end: PointSchema,
  stroke: StrokeSchema2,
  fill: FillSchema
});
var PinSchema = z3.object({
  type: z3.string(),
  shape: z3.string(),
  at: AtSchema2,
  length: z3.number(),
  name: PinNameSchema,
  number: PinNumberSchema
});
var SubSymbolSchema = z3.object({
  name: z3.string(),
  polylines: z3.array(PolylineSchema).optional(),
  rectangles: z3.array(RectangleSchema).optional(),
  pins: z3.array(PinSchema).optional()
});
var PropertySchema2 = z3.object({
  name: z3.string(),
  value: z3.string(),
  at: AtSchema2.optional(),
  effects: EffectsSchema2.optional()
});
var PinNumbersSchema = z3.object({
  hide: z3.boolean().optional()
});
var PinNamesSchema = z3.object({
  offset: z3.number()
});
var SymbolDefinitionSchema = z3.object({
  name: z3.string(),
  pin_numbers: PinNumbersSchema.optional(),
  pin_names: PinNamesSchema.optional(),
  exclude_from_sim: YesNo.optional(),
  in_bom: YesNo.optional(),
  on_board: YesNo.optional(),
  properties: z3.array(PropertySchema2).optional(),
  symbols: z3.array(SubSymbolSchema).optional()
});
var LibSymbolsSchema = z3.object({
  symbols: z3.array(SymbolDefinitionSchema)
});
var SymbolPinSchema = z3.object({
  number: z3.string(),
  uuid: z3.string().optional()
});
var PathInstanceSchema = z3.object({
  path: z3.string(),
  reference: z3.string(),
  unit: z3.number()
});
var ProjectInstanceSchema = z3.object({
  name: z3.string(),
  path: PathInstanceSchema
});
var InstancesSchema = z3.object({
  project: ProjectInstanceSchema
});
var SymbolInstanceSchema = z3.object({
  lib_id: z3.string(),
  at: AtSchema2,
  unit: z3.number(),
  exclude_from_sim: YesNo.optional(),
  in_bom: YesNo.optional(),
  on_board: YesNo.optional(),
  dnp: YesNo.optional(),
  fields_autoplaced: YesNo.optional(),
  uuid: z3.string().optional(),
  properties: z3.array(PropertySchema2).optional(),
  pins: z3.array(SymbolPinSchema).optional(),
  instances: InstancesSchema.optional()
});
var WireSchema = z3.object({
  pts: z3.array(PointSchema),
  stroke: StrokeSchema2,
  uuid: z3.string().optional()
});
var SheetPathSchema = z3.object({
  path: z3.string(),
  page: z3.string()
});
var SheetInstancesSchema = z3.object({
  path: SheetPathSchema
});
var KicadSchSchema = z3.object({
  version: z3.number(),
  generator: z3.string(),
  generator_version: z3.string(),
  uuid: z3.string(),
  paper: z3.string(),
  lib_symbols: LibSymbolsSchema.optional(),
  wires: z3.array(WireSchema).optional(),
  symbols: z3.array(SymbolInstanceSchema).optional(),
  sheet_instances: SheetInstancesSchema.optional()
});

// lib/kicad-sch/parse-kicad-sch.ts
var parse_kicad_sch_exports = {};
__export(parse_kicad_sch_exports, {
  parseKicadSch: () => parseKicadSch
});
function parseKicadSch(sexpr) {
  if (!Array.isArray(sexpr)) {
    throw new Error("Invalid S-expression format for kicad_sch.");
  }
  const root = sexpr;
  const kicadSch = {};
  if (root[0] !== "kicad_sch") {
    throw new Error("Not a kicad_sch file.");
  }
  for (let i = 1; i < root.length; i++) {
    const element = root[i];
    if (!Array.isArray(element)) continue;
    const [key, ...args] = element;
    switch (key) {
      case "version":
        kicadSch.version = parseInt(args[0], 10);
        break;
      case "generator":
        kicadSch.generator = args[0];
        break;
      case "generator_version":
        kicadSch.generator_version = args[0];
        break;
      case "uuid":
        kicadSch.uuid = args[0];
        break;
      case "paper":
        kicadSch.paper = args[0];
        break;
      case "lib_symbols":
        kicadSch.lib_symbols = parseLibSymbols(element);
        break;
      case "wire":
        if (!kicadSch.wires) kicadSch.wires = [];
        kicadSch.wires.push(parseWire(element));
        break;
      case "symbol":
        if (!kicadSch.symbols) kicadSch.symbols = [];
        kicadSch.symbols.push(parseSymbolInstance(element));
        break;
      case "sheet_instances":
        kicadSch.sheet_instances = parseSheetInstances(element);
        break;
      default:
        break;
    }
  }
  return kicadSch;
}
function parseLibSymbols(sexpr) {
  const symbols = [];
  for (let i = 1; i < sexpr.length; i++) {
    const element = sexpr[i];
    if (element[0] === "symbol") {
      symbols.push(parseSymbolDefinition(element));
    }
  }
  return { symbols };
}
function parseSymbolDefinition(sexpr) {
  const symbolDef = {};
  const [, name, ...args] = sexpr;
  symbolDef.name = name;
  symbolDef.properties = [];
  symbolDef.symbols = [];
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "pin_numbers":
        symbolDef.pin_numbers = parsePinNumbers(element);
        break;
      case "pin_names":
        symbolDef.pin_names = parsePinNames(element);
        break;
      case "exclude_from_sim":
        symbolDef.exclude_from_sim = rest[0];
        break;
      case "in_bom":
        symbolDef.in_bom = rest[0];
        break;
      case "on_board":
        symbolDef.on_board = rest[0];
        break;
      case "property":
        symbolDef.properties.push(parseProperty2(element));
        break;
      case "symbol":
        symbolDef.symbols.push(parseSubSymbol(element));
        break;
      default:
        break;
    }
  }
  return symbolDef;
}
function parsePinNumbers(sexpr) {
  const pinNumbers = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    if (key === "hide") {
      pinNumbers.hide = true;
    }
  }
  return pinNumbers;
}
function parsePinNames(sexpr) {
  const pinNames = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, value] = element;
    if (key === "offset") {
      pinNames.offset = parseFloat(value);
    }
  }
  return pinNames;
}
function parseProperty2(sexpr) {
  const [, name, value, ...args] = sexpr;
  const property = {
    name,
    value
  };
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "at":
        property.at = parseAt2(element);
        break;
      case "effects":
        property.effects = parseEffects2(element);
        break;
      default:
        break;
    }
  }
  return property;
}
function parseAt2(sexpr) {
  const [, xStr, yStr, rotationStr] = sexpr;
  const at = {
    x: parseFloat(xStr),
    y: parseFloat(yStr)
  };
  if (rotationStr) {
    at.rotation = parseFloat(rotationStr);
  }
  return at;
}
function parseEffects2(sexpr) {
  const effects = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "font":
        effects.font = parseFont2(element);
        break;
      case "justify":
        effects.justify = rest[0];
        break;
      case "hide":
        effects.hide = rest[0] === "yes";
        break;
      default:
        break;
    }
  }
  return effects;
}
function parseFont2(sexpr) {
  const font = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, xStr, yStr] = element;
    if (key === "size") {
      font.size = [parseFloat(xStr), parseFloat(yStr)];
    }
  }
  return font;
}
function parseSubSymbol(sexpr) {
  const [, name, ...args] = sexpr;
  const subSymbol = { name };
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "polyline":
        if (!subSymbol.polylines) subSymbol.polylines = [];
        subSymbol.polylines.push(parsePolyline(element));
        break;
      case "rectangle":
        if (!subSymbol.rectangles) subSymbol.rectangles = [];
        subSymbol.rectangles.push(parseRectangle(element));
        break;
      case "pin":
        if (!subSymbol.pins) subSymbol.pins = [];
        subSymbol.pins.push(parsePin(element));
        break;
      default:
        break;
    }
  }
  return subSymbol;
}
function parsePolyline(sexpr) {
  const polyline = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "pts":
        polyline.pts = parsePoints(element);
        break;
      case "stroke":
        polyline.stroke = parseStroke2(element);
        break;
      case "fill":
        polyline.fill = parseFill(element);
        break;
      default:
        break;
    }
  }
  return polyline;
}
function parseRectangle(sexpr) {
  const rectangle = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "start":
        rectangle.start = parsePoint(element);
        break;
      case "end":
        rectangle.end = parsePoint(element);
        break;
      case "stroke":
        rectangle.stroke = parseStroke2(element);
        break;
      case "fill":
        rectangle.fill = parseFill(element);
        break;
      default:
        break;
    }
  }
  return rectangle;
}
function parsePoints(sexpr) {
  const points = [];
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    if (element[0] === "xy") {
      points.push(parsePoint(element));
    }
  }
  return points;
}
function parsePoint(sexpr) {
  const [, xStr, yStr] = sexpr;
  return {
    x: parseFloat(xStr),
    y: parseFloat(yStr)
  };
}
function parseStroke2(sexpr) {
  const stroke = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, value] = element;
    switch (key) {
      case "width":
        stroke.width = parseFloat(value);
        break;
      case "type":
        stroke.type = value;
        break;
      default:
        break;
    }
  }
  return stroke;
}
function parseFill(sexpr) {
  const [, ...rest] = sexpr;
  const fill = {};
  for (const element of rest) {
    if (!Array.isArray(element)) continue;
    const [key, value] = element;
    if (key === "type") {
      fill.type = value;
    }
  }
  return fill;
}
function parsePin(sexpr) {
  const [, type, shape, ...args] = sexpr;
  const pin = { type, shape };
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "at":
        pin.at = parseAt2(element);
        break;
      case "length":
        pin.length = parseFloat(rest[0]);
        break;
      case "name":
        pin.name = parsePinNameOrNumber(element);
        break;
      case "number":
        pin.number = parsePinNameOrNumber(element);
        break;
      default:
        break;
    }
  }
  return pin;
}
function parsePinNameOrNumber(sexpr) {
  const [, value, ...args] = sexpr;
  const pinData = {
    name: value,
    number: value
  };
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    if (key === "effects") {
      pinData.effects = parseEffects2(element);
    }
  }
  return pinData;
}
function parseSymbolInstance(sexpr) {
  const symbolInstance = {};
  const [, ...args] = sexpr;
  symbolInstance.properties = [];
  symbolInstance.pins = [];
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "lib_id":
        symbolInstance.lib_id = rest[0];
        break;
      case "at":
        symbolInstance.at = parseAt2(element);
        break;
      case "unit":
        symbolInstance.unit = parseInt(rest[0], 10);
        break;
      case "exclude_from_sim":
        symbolInstance.exclude_from_sim = rest[0];
        break;
      case "in_bom":
        symbolInstance.in_bom = rest[0];
        break;
      case "on_board":
        symbolInstance.on_board = rest[0];
        break;
      case "dnp":
        symbolInstance.dnp = rest[0];
        break;
      case "fields_autoplaced":
        symbolInstance.fields_autoplaced = rest[0];
        break;
      case "uuid":
        symbolInstance.uuid = rest[0];
        break;
      case "property":
        symbolInstance.properties.push(parseProperty2(element));
        break;
      case "pin":
        symbolInstance.pins.push(parseSymbolPin(element));
        break;
      case "instances":
        symbolInstance.instances = parseInstances(element);
        break;
      default:
        break;
    }
  }
  return symbolInstance;
}
function parseSymbolPin(sexpr) {
  const [, numberStr, ...args] = sexpr;
  const pin = { number: numberStr };
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, value] = element;
    if (key === "uuid") {
      pin.uuid = value;
    }
  }
  return pin;
}
function parseInstances(sexpr) {
  const projectInstance = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    if (key === "project") {
      projectInstance.name = rest[0];
      projectInstance.path = parsePathInstance(element);
    }
  }
  return { project: projectInstance };
}
function parsePathInstance(sexpr) {
  const [, name, ...args] = sexpr;
  const pathInstance = {};
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    if (key === "path") {
      pathInstance.path = rest[0];
      for (const subElement of rest.slice(1)) {
        if (!Array.isArray(subElement)) continue;
        const [subKey, subValue] = subElement;
        if (subKey === "reference") {
          pathInstance.reference = subValue;
        } else if (subKey === "unit") {
          pathInstance.unit = parseInt(subValue, 10);
        }
      }
    }
  }
  return pathInstance;
}
function parseWire(sexpr) {
  const wire = {};
  for (const element of sexpr.slice(1)) {
    if (!Array.isArray(element)) continue;
    const [key, ...rest] = element;
    switch (key) {
      case "pts":
        wire.pts = parsePoints(element);
        break;
      case "stroke":
        wire.stroke = parseStroke2(element);
        break;
      case "uuid":
        wire.uuid = rest[0];
        break;
      default:
        break;
    }
  }
  return wire;
}
function parseSheetInstances(sexpr) {
  const [, pathElement] = sexpr;
  const sheetInstances = {
    path: parseSheetPath(pathElement)
  };
  return sheetInstances;
}
function parseSheetPath(sexpr) {
  const [, pathStr, ...args] = sexpr;
  const sheetPath = { path: pathStr, page: "" };
  for (const element of args) {
    if (!Array.isArray(element)) continue;
    const [key, value] = element;
    if (key === "page") {
      sheetPath.page = value;
    }
  }
  return sheetPath;
}

// lib/kicad-sch/namespace.ts
var KicadSch = {
  ...types_exports,
  ...zod_exports,
  ...parse_kicad_sch_exports
};
export {
  AtSchema,
  BoardSchema,
  BomFieldSchema,
  BomFormatSettingsSchema,
  BomSettingsSchema,
  CvPcbSchema,
  DefaultsSchema,
  DesignSettingsSchema,
  DimensionsSchema,
  DrawingSchema,
  EffectsSchema,
  ErcSchema,
  FontSchema,
  FootprintSchema,
  FpLineSchema,
  FpTextSchema,
  GeneralSchema,
  GrRectSchema,
  Ipc2581Schema,
  KiCadPcbSchema,
  KicadProjectSchema,
  KicadSch,
  LastPathsSchema,
  LayerSchema,
  LibrariesSchema,
  MetaSchema,
  ModelSchema,
  NetClassSchema,
  NetReferenceSchema,
  NetSchema,
  NetSettingsSchema,
  PadSchema,
  PadsSchema,
  PcbNewSchema,
  PcbPlotParamsSchema,
  PropertySchema,
  RulesSchema,
  SchematicSchema,
  SegmentSchema,
  SetupSchema,
  StrokeSchema,
  TeardropOptionSchema,
  TeardropParameterSchema,
  TuningPatternDefaultsSchema,
  TuningPatternSettingsSchema,
  ViaSchema,
  ZonesSchema,
  convertCircuitJsonToKiCadPcb,
  convertCircuitJsonToKicadPro,
  convertKiCadPcbToCircuitJson,
  convertKiCadPcbToSExprString,
  mapKicadLayerToTscircuitLayer,
  mapTscircuitLayerToKicadLayer,
  parseKiCadPcb,
  yesnobool
};
//# sourceMappingURL=index.mjs.map