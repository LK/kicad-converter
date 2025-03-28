import * as CJ from '@tscircuit/soup';
import { AnyCircuitElement } from '@tscircuit/soup';
import * as zod from 'zod';
import { z } from 'zod';

type YesNoBool = "yes" | "no" | boolean;
interface KiCadPcb {
    version: number;
    generator: string;
    generator_version: string;
    general: General;
    paper: string;
    layers: Layer[];
    setup: Setup;
    nets: Net[];
    footprints: Footprint[];
    gr_rects: GrRect[];
    gr_lines?: GrLine[];
    segments: Segment[];
    vias: Via[];
}
interface GrLine {
    start: [number, number];
    end: [number, number];
    layer: string;
    width: number;
}
interface Via {
    at: [number, number];
    size: number;
    drill: number;
    layers: string[];
    net: number;
    uuid: string;
}
interface General {
    thickness: number;
    legacy_teardrops: YesNoBool;
}
interface Layer {
    id: number;
    name: string;
    type: string;
    description?: string;
}
interface Setup {
    pad_to_mask_clearance: number;
    allow_soldermask_bridges_in_footprints: YesNoBool;
    pcbplotparams: PcbPlotParams;
}
interface PcbPlotParams {
    layerselection: string;
    plot_on_all_layers_selection: string;
    disableapertmacros: YesNoBool;
    usegerberextensions: YesNoBool;
    usegerberattributes: YesNoBool;
    usegerberadvancedattributes: YesNoBool;
    creategerberjobfile: YesNoBool;
    dashed_line_dash_ratio: number;
    dashed_line_gap_ratio: number;
    svgprecision: number;
    plotframeref: YesNoBool;
    viasonmask: YesNoBool;
    mode: number;
    useauxorigin: YesNoBool;
    hpglpennumber: number;
    hpglpenspeed: number;
    hpglpendiameter: number;
    pdf_front_fp_property_popups: YesNoBool;
    pdf_back_fp_property_popups: YesNoBool;
    dxfpolygonmode: YesNoBool;
    dxfimperialunits: YesNoBool;
    dxfusepcbnewfont: YesNoBool;
    psnegative: YesNoBool;
    psa4output: YesNoBool;
    plotreference: YesNoBool;
    plotvalue: YesNoBool;
    plotfptext: YesNoBool;
    plotinvisibletext: YesNoBool;
    sketchpadsonfab: YesNoBool;
    subtractmaskfromsilk: YesNoBool;
    outputformat: number;
    mirror: YesNoBool;
    drillshape: number;
    scaleselection: number;
    outputdirectory: string;
}
interface Net {
    id: number;
    name: string;
}
interface Footprint {
    footprint: string;
    layer: string;
    uuid: string;
    at: At$1;
    descr?: string;
    tags?: string;
    properties?: Property$1[];
    path?: string;
    sheetname?: string;
    sheetfile?: string;
    attr?: string;
    fp_lines?: FpLine[];
    fp_texts?: FpText[];
    pads?: Pad[];
    model?: Model;
}
interface At$1 {
    x: number;
    y: number;
    rotation?: number;
}
interface Property$1 {
    name: string;
    value: string;
    at?: At$1;
    layer?: string;
    uuid?: string;
    unlocked?: boolean;
    hide?: boolean;
    effects?: Effects$1;
}
interface Effects$1 {
    font?: Font$1;
}
interface Font$1 {
    size: [number, number];
    thickness: number;
}
interface FpLine {
    start: [number, number];
    end: [number, number];
    stroke: Stroke$1;
    layer: string;
    uuid?: string;
}
interface Stroke$1 {
    width: number;
    type: string;
}
interface FpText {
    type: string;
    text: string;
    at: At$1;
    layer: string;
    uuid?: string;
    effects?: Effects$1;
}
interface Pad {
    number: string;
    type: "np_thru_hole" | "thru_hole" | "smd";
    drill?: number;
    shape: "rect" | "roundrect" | "oval" | "circle";
    at: [number, number];
    size: [number, number];
    layers: string[];
    roundrect_rratio?: number;
    net?: NetReference;
    pintype?: string;
    uuid?: string;
}
interface NetReference {
    id: number;
    name?: string;
}
interface Model {
    path: string;
    offset?: {
        xyz: [number, number, number];
    };
    scale?: {
        xyz: [number, number, number];
    };
    rotate?: {
        xyz: [number, number, number];
    };
}
interface GrRect {
    start: [number, number];
    end: [number, number];
    stroke: Stroke$1;
    fill: string;
    layer: string;
    uuid?: string;
}
interface Segment {
    start: [number, number];
    end: [number, number];
    width: number;
    layer: string;
    net: number;
    uuid?: string;
}

declare function convertCircuitJsonToKiCadPcb(circuitJson: CJ.AnyCircuitElement[]): KiCadPcb;

declare function convertKiCadPcbToSExprString(kicadPcb: KiCadPcb): string;

type SExpr = string | SExpr[];

declare function parseKiCadPcb(sexpr: SExpr | string): KiCadPcb;

declare function convertKiCadPcbToCircuitJson(kicadPcb: KiCadPcb): CJ.AnyCircuitElement[];
declare function mapKicadLayerToTscircuitLayer(kicadLayer: string): CJ.LayerRef | null;
declare function mapTscircuitLayerToKicadLayer(tscircuitLayer: CJ.LayerRef): string | null;

declare const yesnobool: z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">;
declare const GeneralSchema: z.ZodObject<{
    thickness: z.ZodNumber;
    legacy_teardrops: z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">;
}, "strip", z.ZodTypeAny, {
    thickness: number;
    legacy_teardrops: boolean;
}, {
    thickness: number;
    legacy_teardrops: boolean | "yes" | "no";
}>;
type ZodGeneral = z.infer<typeof GeneralSchema>;
declare const LayerSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    type: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: string;
    name: string;
    id: number;
    description?: string | undefined;
}, {
    type: string;
    name: string;
    id: number;
    description?: string | undefined;
}>;
type ZodLayer = z.infer<typeof LayerSchema>;
declare const PcbPlotParamsSchema: z.ZodObject<{
    layerselection: z.ZodOptional<z.ZodString>;
    plot_on_all_layers_selection: z.ZodString;
    disableapertmacros: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    usegerberextensions: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    usegerberattributes: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    usegerberadvancedattributes: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    creategerberjobfile: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    dashed_line_dash_ratio: z.ZodOptional<z.ZodNumber>;
    dashed_line_gap_ratio: z.ZodOptional<z.ZodNumber>;
    svgprecision: z.ZodNumber;
    plotframeref: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    viasonmask: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    mode: z.ZodOptional<z.ZodNumber>;
    useauxorigin: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    hpglpennumber: z.ZodNumber;
    hpglpenspeed: z.ZodOptional<z.ZodNumber>;
    hpglpendiameter: z.ZodOptional<z.ZodNumber>;
    pdf_front_fp_property_popups: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    pdf_back_fp_property_popups: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    dxfpolygonmode: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    dxfimperialunits: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    dxfusepcbnewfont: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    psnegative: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    psa4output: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    plotreference: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    plotvalue: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    plotfptext: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    plotinvisibletext: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    sketchpadsonfab: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    subtractmaskfromsilk: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    outputformat: z.ZodOptional<z.ZodNumber>;
    mirror: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
    drillshape: z.ZodOptional<z.ZodNumber>;
    scaleselection: z.ZodOptional<z.ZodNumber>;
    outputdirectory: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    plot_on_all_layers_selection: string;
    svgprecision: number;
    hpglpennumber: number;
    layerselection?: string | undefined;
    disableapertmacros?: boolean | undefined;
    usegerberextensions?: boolean | undefined;
    usegerberattributes?: boolean | undefined;
    usegerberadvancedattributes?: boolean | undefined;
    creategerberjobfile?: boolean | undefined;
    plotframeref?: boolean | undefined;
    viasonmask?: boolean | undefined;
    mode?: number | undefined;
    useauxorigin?: boolean | undefined;
    hpglpenspeed?: number | undefined;
    hpglpendiameter?: number | undefined;
    dxfpolygonmode?: boolean | undefined;
    dxfimperialunits?: boolean | undefined;
    dxfusepcbnewfont?: boolean | undefined;
    psnegative?: boolean | undefined;
    psa4output?: boolean | undefined;
    plotreference?: boolean | undefined;
    plotvalue?: boolean | undefined;
    plotinvisibletext?: boolean | undefined;
    sketchpadsonfab?: boolean | undefined;
    subtractmaskfromsilk?: boolean | undefined;
    outputformat?: number | undefined;
    mirror?: boolean | undefined;
    drillshape?: number | undefined;
    scaleselection?: number | undefined;
    outputdirectory?: string | undefined;
    dashed_line_dash_ratio?: number | undefined;
    dashed_line_gap_ratio?: number | undefined;
    pdf_front_fp_property_popups?: boolean | undefined;
    pdf_back_fp_property_popups?: boolean | undefined;
    plotfptext?: boolean | undefined;
}, {
    plot_on_all_layers_selection: string;
    svgprecision: number;
    hpglpennumber: number;
    layerselection?: string | undefined;
    disableapertmacros?: boolean | "yes" | "no" | undefined;
    usegerberextensions?: boolean | "yes" | "no" | undefined;
    usegerberattributes?: boolean | "yes" | "no" | undefined;
    usegerberadvancedattributes?: boolean | "yes" | "no" | undefined;
    creategerberjobfile?: boolean | "yes" | "no" | undefined;
    plotframeref?: boolean | "yes" | "no" | undefined;
    viasonmask?: boolean | "yes" | "no" | undefined;
    mode?: number | undefined;
    useauxorigin?: boolean | "yes" | "no" | undefined;
    hpglpenspeed?: number | undefined;
    hpglpendiameter?: number | undefined;
    dxfpolygonmode?: boolean | "yes" | "no" | undefined;
    dxfimperialunits?: boolean | "yes" | "no" | undefined;
    dxfusepcbnewfont?: boolean | "yes" | "no" | undefined;
    psnegative?: boolean | "yes" | "no" | undefined;
    psa4output?: boolean | "yes" | "no" | undefined;
    plotreference?: boolean | "yes" | "no" | undefined;
    plotvalue?: boolean | "yes" | "no" | undefined;
    plotinvisibletext?: boolean | "yes" | "no" | undefined;
    sketchpadsonfab?: boolean | "yes" | "no" | undefined;
    subtractmaskfromsilk?: boolean | "yes" | "no" | undefined;
    outputformat?: number | undefined;
    mirror?: boolean | "yes" | "no" | undefined;
    drillshape?: number | undefined;
    scaleselection?: number | undefined;
    outputdirectory?: string | undefined;
    dashed_line_dash_ratio?: number | undefined;
    dashed_line_gap_ratio?: number | undefined;
    pdf_front_fp_property_popups?: boolean | "yes" | "no" | undefined;
    pdf_back_fp_property_popups?: boolean | "yes" | "no" | undefined;
    plotfptext?: boolean | "yes" | "no" | undefined;
}>;
type ZodPcbPlotParams = z.infer<typeof PcbPlotParamsSchema>;
declare const SetupSchema: z.ZodObject<{
    pad_to_mask_clearance: z.ZodNumber;
    allow_soldermask_bridges_in_footprints: z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">;
    pcbplotparams: z.ZodObject<{
        layerselection: z.ZodOptional<z.ZodString>;
        plot_on_all_layers_selection: z.ZodString;
        disableapertmacros: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        usegerberextensions: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        usegerberattributes: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        usegerberadvancedattributes: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        creategerberjobfile: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        dashed_line_dash_ratio: z.ZodOptional<z.ZodNumber>;
        dashed_line_gap_ratio: z.ZodOptional<z.ZodNumber>;
        svgprecision: z.ZodNumber;
        plotframeref: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        viasonmask: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        mode: z.ZodOptional<z.ZodNumber>;
        useauxorigin: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        hpglpennumber: z.ZodNumber;
        hpglpenspeed: z.ZodOptional<z.ZodNumber>;
        hpglpendiameter: z.ZodOptional<z.ZodNumber>;
        pdf_front_fp_property_popups: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        pdf_back_fp_property_popups: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        dxfpolygonmode: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        dxfimperialunits: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        dxfusepcbnewfont: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        psnegative: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        psa4output: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        plotreference: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        plotvalue: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        plotfptext: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        plotinvisibletext: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        sketchpadsonfab: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        subtractmaskfromsilk: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        outputformat: z.ZodOptional<z.ZodNumber>;
        mirror: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
        drillshape: z.ZodOptional<z.ZodNumber>;
        scaleselection: z.ZodOptional<z.ZodNumber>;
        outputdirectory: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        plot_on_all_layers_selection: string;
        svgprecision: number;
        hpglpennumber: number;
        layerselection?: string | undefined;
        disableapertmacros?: boolean | undefined;
        usegerberextensions?: boolean | undefined;
        usegerberattributes?: boolean | undefined;
        usegerberadvancedattributes?: boolean | undefined;
        creategerberjobfile?: boolean | undefined;
        plotframeref?: boolean | undefined;
        viasonmask?: boolean | undefined;
        mode?: number | undefined;
        useauxorigin?: boolean | undefined;
        hpglpenspeed?: number | undefined;
        hpglpendiameter?: number | undefined;
        dxfpolygonmode?: boolean | undefined;
        dxfimperialunits?: boolean | undefined;
        dxfusepcbnewfont?: boolean | undefined;
        psnegative?: boolean | undefined;
        psa4output?: boolean | undefined;
        plotreference?: boolean | undefined;
        plotvalue?: boolean | undefined;
        plotinvisibletext?: boolean | undefined;
        sketchpadsonfab?: boolean | undefined;
        subtractmaskfromsilk?: boolean | undefined;
        outputformat?: number | undefined;
        mirror?: boolean | undefined;
        drillshape?: number | undefined;
        scaleselection?: number | undefined;
        outputdirectory?: string | undefined;
        dashed_line_dash_ratio?: number | undefined;
        dashed_line_gap_ratio?: number | undefined;
        pdf_front_fp_property_popups?: boolean | undefined;
        pdf_back_fp_property_popups?: boolean | undefined;
        plotfptext?: boolean | undefined;
    }, {
        plot_on_all_layers_selection: string;
        svgprecision: number;
        hpglpennumber: number;
        layerselection?: string | undefined;
        disableapertmacros?: boolean | "yes" | "no" | undefined;
        usegerberextensions?: boolean | "yes" | "no" | undefined;
        usegerberattributes?: boolean | "yes" | "no" | undefined;
        usegerberadvancedattributes?: boolean | "yes" | "no" | undefined;
        creategerberjobfile?: boolean | "yes" | "no" | undefined;
        plotframeref?: boolean | "yes" | "no" | undefined;
        viasonmask?: boolean | "yes" | "no" | undefined;
        mode?: number | undefined;
        useauxorigin?: boolean | "yes" | "no" | undefined;
        hpglpenspeed?: number | undefined;
        hpglpendiameter?: number | undefined;
        dxfpolygonmode?: boolean | "yes" | "no" | undefined;
        dxfimperialunits?: boolean | "yes" | "no" | undefined;
        dxfusepcbnewfont?: boolean | "yes" | "no" | undefined;
        psnegative?: boolean | "yes" | "no" | undefined;
        psa4output?: boolean | "yes" | "no" | undefined;
        plotreference?: boolean | "yes" | "no" | undefined;
        plotvalue?: boolean | "yes" | "no" | undefined;
        plotinvisibletext?: boolean | "yes" | "no" | undefined;
        sketchpadsonfab?: boolean | "yes" | "no" | undefined;
        subtractmaskfromsilk?: boolean | "yes" | "no" | undefined;
        outputformat?: number | undefined;
        mirror?: boolean | "yes" | "no" | undefined;
        drillshape?: number | undefined;
        scaleselection?: number | undefined;
        outputdirectory?: string | undefined;
        dashed_line_dash_ratio?: number | undefined;
        dashed_line_gap_ratio?: number | undefined;
        pdf_front_fp_property_popups?: boolean | "yes" | "no" | undefined;
        pdf_back_fp_property_popups?: boolean | "yes" | "no" | undefined;
        plotfptext?: boolean | "yes" | "no" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    pad_to_mask_clearance: number;
    allow_soldermask_bridges_in_footprints: boolean;
    pcbplotparams: {
        plot_on_all_layers_selection: string;
        svgprecision: number;
        hpglpennumber: number;
        layerselection?: string | undefined;
        disableapertmacros?: boolean | undefined;
        usegerberextensions?: boolean | undefined;
        usegerberattributes?: boolean | undefined;
        usegerberadvancedattributes?: boolean | undefined;
        creategerberjobfile?: boolean | undefined;
        plotframeref?: boolean | undefined;
        viasonmask?: boolean | undefined;
        mode?: number | undefined;
        useauxorigin?: boolean | undefined;
        hpglpenspeed?: number | undefined;
        hpglpendiameter?: number | undefined;
        dxfpolygonmode?: boolean | undefined;
        dxfimperialunits?: boolean | undefined;
        dxfusepcbnewfont?: boolean | undefined;
        psnegative?: boolean | undefined;
        psa4output?: boolean | undefined;
        plotreference?: boolean | undefined;
        plotvalue?: boolean | undefined;
        plotinvisibletext?: boolean | undefined;
        sketchpadsonfab?: boolean | undefined;
        subtractmaskfromsilk?: boolean | undefined;
        outputformat?: number | undefined;
        mirror?: boolean | undefined;
        drillshape?: number | undefined;
        scaleselection?: number | undefined;
        outputdirectory?: string | undefined;
        dashed_line_dash_ratio?: number | undefined;
        dashed_line_gap_ratio?: number | undefined;
        pdf_front_fp_property_popups?: boolean | undefined;
        pdf_back_fp_property_popups?: boolean | undefined;
        plotfptext?: boolean | undefined;
    };
}, {
    pad_to_mask_clearance: number;
    allow_soldermask_bridges_in_footprints: boolean | "yes" | "no";
    pcbplotparams: {
        plot_on_all_layers_selection: string;
        svgprecision: number;
        hpglpennumber: number;
        layerselection?: string | undefined;
        disableapertmacros?: boolean | "yes" | "no" | undefined;
        usegerberextensions?: boolean | "yes" | "no" | undefined;
        usegerberattributes?: boolean | "yes" | "no" | undefined;
        usegerberadvancedattributes?: boolean | "yes" | "no" | undefined;
        creategerberjobfile?: boolean | "yes" | "no" | undefined;
        plotframeref?: boolean | "yes" | "no" | undefined;
        viasonmask?: boolean | "yes" | "no" | undefined;
        mode?: number | undefined;
        useauxorigin?: boolean | "yes" | "no" | undefined;
        hpglpenspeed?: number | undefined;
        hpglpendiameter?: number | undefined;
        dxfpolygonmode?: boolean | "yes" | "no" | undefined;
        dxfimperialunits?: boolean | "yes" | "no" | undefined;
        dxfusepcbnewfont?: boolean | "yes" | "no" | undefined;
        psnegative?: boolean | "yes" | "no" | undefined;
        psa4output?: boolean | "yes" | "no" | undefined;
        plotreference?: boolean | "yes" | "no" | undefined;
        plotvalue?: boolean | "yes" | "no" | undefined;
        plotinvisibletext?: boolean | "yes" | "no" | undefined;
        sketchpadsonfab?: boolean | "yes" | "no" | undefined;
        subtractmaskfromsilk?: boolean | "yes" | "no" | undefined;
        outputformat?: number | undefined;
        mirror?: boolean | "yes" | "no" | undefined;
        drillshape?: number | undefined;
        scaleselection?: number | undefined;
        outputdirectory?: string | undefined;
        dashed_line_dash_ratio?: number | undefined;
        dashed_line_gap_ratio?: number | undefined;
        pdf_front_fp_property_popups?: boolean | "yes" | "no" | undefined;
        pdf_back_fp_property_popups?: boolean | "yes" | "no" | undefined;
        plotfptext?: boolean | "yes" | "no" | undefined;
    };
}>;
type ZodSetup = z.infer<typeof SetupSchema>;
declare const NetSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
}, {
    name: string;
    id: number;
}>;
type ZodNet = z.infer<typeof NetSchema>;
declare const AtSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    rotation: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    rotation?: number | undefined;
}, {
    x: number;
    y: number;
    rotation?: number | undefined;
}>;
type ZodAt = z.infer<typeof AtSchema>;
declare const FontSchema: z.ZodObject<{
    size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    thickness: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    thickness: number;
    size: [number, number];
}, {
    thickness: number;
    size: [number, number];
}>;
type ZodFont = z.infer<typeof FontSchema>;
declare const EffectsSchema: z.ZodObject<{
    font: z.ZodOptional<z.ZodObject<{
        size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        thickness: number;
        size: [number, number];
    }, {
        thickness: number;
        size: [number, number];
    }>>;
}, "strip", z.ZodTypeAny, {
    font?: {
        thickness: number;
        size: [number, number];
    } | undefined;
}, {
    font?: {
        thickness: number;
        size: [number, number];
    } | undefined;
}>;
type ZodEffects = z.infer<typeof EffectsSchema>;
declare const PropertySchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
    at: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        rotation: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }>>;
    layer: z.ZodOptional<z.ZodString>;
    uuid: z.ZodOptional<z.ZodString>;
    unlocked: z.ZodOptional<z.ZodBoolean>;
    hide: z.ZodOptional<z.ZodBoolean>;
    effects: z.ZodOptional<z.ZodObject<{
        font: z.ZodOptional<z.ZodObject<{
            size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            thickness: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            thickness: number;
            size: [number, number];
        }, {
            thickness: number;
            size: [number, number];
        }>>;
    }, "strip", z.ZodTypeAny, {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    }, {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    value: string;
    layer?: string | undefined;
    at?: {
        x: number;
        y: number;
        rotation?: number | undefined;
    } | undefined;
    uuid?: string | undefined;
    unlocked?: boolean | undefined;
    hide?: boolean | undefined;
    effects?: {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    } | undefined;
}, {
    name: string;
    value: string;
    layer?: string | undefined;
    at?: {
        x: number;
        y: number;
        rotation?: number | undefined;
    } | undefined;
    uuid?: string | undefined;
    unlocked?: boolean | undefined;
    hide?: boolean | undefined;
    effects?: {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    } | undefined;
}>;
type ZodProperty = z.infer<typeof PropertySchema>;
declare const StrokeSchema: z.ZodObject<{
    width: z.ZodNumber;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    width: number;
}, {
    type: string;
    width: number;
}>;
type ZodStroke = z.infer<typeof StrokeSchema>;
declare const FpLineSchema: z.ZodObject<{
    start: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    end: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    stroke: z.ZodObject<{
        width: z.ZodNumber;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        width: number;
    }, {
        type: string;
        width: number;
    }>;
    layer: z.ZodString;
    uuid: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    layer: string;
    start: [number, number];
    end: [number, number];
    stroke: {
        type: string;
        width: number;
    };
    uuid?: string | undefined;
}, {
    layer: string;
    start: [number, number];
    end: [number, number];
    stroke: {
        type: string;
        width: number;
    };
    uuid?: string | undefined;
}>;
type ZodFpLine = z.infer<typeof FpLineSchema>;
declare const FpTextSchema: z.ZodObject<{
    type: z.ZodString;
    text: z.ZodString;
    at: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        rotation: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }>;
    layer: z.ZodString;
    uuid: z.ZodOptional<z.ZodString>;
    effects: z.ZodOptional<z.ZodObject<{
        font: z.ZodOptional<z.ZodObject<{
            size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            thickness: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            thickness: number;
            size: [number, number];
        }, {
            thickness: number;
            size: [number, number];
        }>>;
    }, "strip", z.ZodTypeAny, {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    }, {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: string;
    layer: string;
    at: {
        x: number;
        y: number;
        rotation?: number | undefined;
    };
    text: string;
    uuid?: string | undefined;
    effects?: {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    } | undefined;
}, {
    type: string;
    layer: string;
    at: {
        x: number;
        y: number;
        rotation?: number | undefined;
    };
    text: string;
    uuid?: string | undefined;
    effects?: {
        font?: {
            thickness: number;
            size: [number, number];
        } | undefined;
    } | undefined;
}>;
type ZodFpText = z.infer<typeof FpTextSchema>;
declare const NetReferenceSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    name?: string | undefined;
}, {
    id: number;
    name?: string | undefined;
}>;
type ZodNetReference = z.infer<typeof NetReferenceSchema>;
declare const PadSchema: z.ZodObject<{
    number: z.ZodString;
    type: z.ZodEnum<["thru_hole", "np_thru_hole", "smd"]>;
    shape: z.ZodEnum<["rect", "roundrect", "oval", "circle"]>;
    drill: z.ZodOptional<z.ZodNumber>;
    at: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    layers: z.ZodArray<z.ZodString, "many">;
    roundrect_rratio: z.ZodOptional<z.ZodNumber>;
    net: z.ZodOptional<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name?: string | undefined;
    }, {
        id: number;
        name?: string | undefined;
    }>>;
    pintype: z.ZodOptional<z.ZodString>;
    uuid: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: string;
    type: "np_thru_hole" | "thru_hole" | "smd";
    layers: string[];
    at: [number, number];
    shape: "rect" | "roundrect" | "oval" | "circle";
    size: [number, number];
    uuid?: string | undefined;
    drill?: number | undefined;
    roundrect_rratio?: number | undefined;
    net?: {
        id: number;
        name?: string | undefined;
    } | undefined;
    pintype?: string | undefined;
}, {
    number: string;
    type: "np_thru_hole" | "thru_hole" | "smd";
    layers: string[];
    at: [number, number];
    shape: "rect" | "roundrect" | "oval" | "circle";
    size: [number, number];
    uuid?: string | undefined;
    drill?: number | undefined;
    roundrect_rratio?: number | undefined;
    net?: {
        id: number;
        name?: string | undefined;
    } | undefined;
    pintype?: string | undefined;
}>;
type ZodPad = z.infer<typeof PadSchema>;
declare const ModelSchema: z.ZodObject<{
    path: z.ZodString;
    offset: z.ZodOptional<z.ZodObject<{
        xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    }, "strip", z.ZodTypeAny, {
        xyz: [number, number, number];
    }, {
        xyz: [number, number, number];
    }>>;
    scale: z.ZodOptional<z.ZodObject<{
        xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    }, "strip", z.ZodTypeAny, {
        xyz: [number, number, number];
    }, {
        xyz: [number, number, number];
    }>>;
    rotate: z.ZodOptional<z.ZodObject<{
        xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    }, "strip", z.ZodTypeAny, {
        xyz: [number, number, number];
    }, {
        xyz: [number, number, number];
    }>>;
}, "strip", z.ZodTypeAny, {
    path: string;
    offset?: {
        xyz: [number, number, number];
    } | undefined;
    scale?: {
        xyz: [number, number, number];
    } | undefined;
    rotate?: {
        xyz: [number, number, number];
    } | undefined;
}, {
    path: string;
    offset?: {
        xyz: [number, number, number];
    } | undefined;
    scale?: {
        xyz: [number, number, number];
    } | undefined;
    rotate?: {
        xyz: [number, number, number];
    } | undefined;
}>;
type ZodModel = z.infer<typeof ModelSchema>;
declare const FootprintSchema: z.ZodObject<{
    footprint: z.ZodString;
    layer: z.ZodString;
    uuid: z.ZodString;
    at: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        rotation: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }>;
    descr: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodString>;
    properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        at: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            rotation: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }>>;
        layer: z.ZodOptional<z.ZodString>;
        uuid: z.ZodOptional<z.ZodString>;
        unlocked: z.ZodOptional<z.ZodBoolean>;
        hide: z.ZodOptional<z.ZodBoolean>;
        effects: z.ZodOptional<z.ZodObject<{
            font: z.ZodOptional<z.ZodObject<{
                size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
                thickness: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                thickness: number;
                size: [number, number];
            }, {
                thickness: number;
                size: [number, number];
            }>>;
        }, "strip", z.ZodTypeAny, {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        }, {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        value: string;
        layer?: string | undefined;
        at?: {
            x: number;
            y: number;
            rotation?: number | undefined;
        } | undefined;
        uuid?: string | undefined;
        unlocked?: boolean | undefined;
        hide?: boolean | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }, {
        name: string;
        value: string;
        layer?: string | undefined;
        at?: {
            x: number;
            y: number;
            rotation?: number | undefined;
        } | undefined;
        uuid?: string | undefined;
        unlocked?: boolean | undefined;
        hide?: boolean | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }>, "many">>;
    path: z.ZodOptional<z.ZodString>;
    sheetname: z.ZodOptional<z.ZodString>;
    sheetfile: z.ZodOptional<z.ZodString>;
    attr: z.ZodOptional<z.ZodString>;
    fp_lines: z.ZodOptional<z.ZodArray<z.ZodObject<{
        start: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        end: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        stroke: z.ZodObject<{
            width: z.ZodNumber;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            width: number;
        }, {
            type: string;
            width: number;
        }>;
        layer: z.ZodString;
        uuid: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        layer: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }, {
        layer: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }>, "many">>;
    fp_texts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        text: z.ZodString;
        at: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            rotation: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }>;
        layer: z.ZodString;
        uuid: z.ZodOptional<z.ZodString>;
        effects: z.ZodOptional<z.ZodObject<{
            font: z.ZodOptional<z.ZodObject<{
                size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
                thickness: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                thickness: number;
                size: [number, number];
            }, {
                thickness: number;
                size: [number, number];
            }>>;
        }, "strip", z.ZodTypeAny, {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        }, {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        text: string;
        uuid?: string | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }, {
        type: string;
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        text: string;
        uuid?: string | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }>, "many">>;
    pads: z.ZodOptional<z.ZodArray<z.ZodObject<{
        number: z.ZodString;
        type: z.ZodEnum<["thru_hole", "np_thru_hole", "smd"]>;
        shape: z.ZodEnum<["rect", "roundrect", "oval", "circle"]>;
        drill: z.ZodOptional<z.ZodNumber>;
        at: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        layers: z.ZodArray<z.ZodString, "many">;
        roundrect_rratio: z.ZodOptional<z.ZodNumber>;
        net: z.ZodOptional<z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: number;
            name?: string | undefined;
        }, {
            id: number;
            name?: string | undefined;
        }>>;
        pintype: z.ZodOptional<z.ZodString>;
        uuid: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        number: string;
        type: "np_thru_hole" | "thru_hole" | "smd";
        layers: string[];
        at: [number, number];
        shape: "rect" | "roundrect" | "oval" | "circle";
        size: [number, number];
        uuid?: string | undefined;
        drill?: number | undefined;
        roundrect_rratio?: number | undefined;
        net?: {
            id: number;
            name?: string | undefined;
        } | undefined;
        pintype?: string | undefined;
    }, {
        number: string;
        type: "np_thru_hole" | "thru_hole" | "smd";
        layers: string[];
        at: [number, number];
        shape: "rect" | "roundrect" | "oval" | "circle";
        size: [number, number];
        uuid?: string | undefined;
        drill?: number | undefined;
        roundrect_rratio?: number | undefined;
        net?: {
            id: number;
            name?: string | undefined;
        } | undefined;
        pintype?: string | undefined;
    }>, "many">>;
    model: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        offset: z.ZodOptional<z.ZodObject<{
            xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        }, "strip", z.ZodTypeAny, {
            xyz: [number, number, number];
        }, {
            xyz: [number, number, number];
        }>>;
        scale: z.ZodOptional<z.ZodObject<{
            xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        }, "strip", z.ZodTypeAny, {
            xyz: [number, number, number];
        }, {
            xyz: [number, number, number];
        }>>;
        rotate: z.ZodOptional<z.ZodObject<{
            xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        }, "strip", z.ZodTypeAny, {
            xyz: [number, number, number];
        }, {
            xyz: [number, number, number];
        }>>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        offset?: {
            xyz: [number, number, number];
        } | undefined;
        scale?: {
            xyz: [number, number, number];
        } | undefined;
        rotate?: {
            xyz: [number, number, number];
        } | undefined;
    }, {
        path: string;
        offset?: {
            xyz: [number, number, number];
        } | undefined;
        scale?: {
            xyz: [number, number, number];
        } | undefined;
        rotate?: {
            xyz: [number, number, number];
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    layer: string;
    at: {
        x: number;
        y: number;
        rotation?: number | undefined;
    };
    uuid: string;
    footprint: string;
    path?: string | undefined;
    descr?: string | undefined;
    tags?: string | undefined;
    properties?: {
        name: string;
        value: string;
        layer?: string | undefined;
        at?: {
            x: number;
            y: number;
            rotation?: number | undefined;
        } | undefined;
        uuid?: string | undefined;
        unlocked?: boolean | undefined;
        hide?: boolean | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }[] | undefined;
    sheetname?: string | undefined;
    sheetfile?: string | undefined;
    attr?: string | undefined;
    fp_lines?: {
        layer: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }[] | undefined;
    fp_texts?: {
        type: string;
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        text: string;
        uuid?: string | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }[] | undefined;
    pads?: {
        number: string;
        type: "np_thru_hole" | "thru_hole" | "smd";
        layers: string[];
        at: [number, number];
        shape: "rect" | "roundrect" | "oval" | "circle";
        size: [number, number];
        uuid?: string | undefined;
        drill?: number | undefined;
        roundrect_rratio?: number | undefined;
        net?: {
            id: number;
            name?: string | undefined;
        } | undefined;
        pintype?: string | undefined;
    }[] | undefined;
    model?: {
        path: string;
        offset?: {
            xyz: [number, number, number];
        } | undefined;
        scale?: {
            xyz: [number, number, number];
        } | undefined;
        rotate?: {
            xyz: [number, number, number];
        } | undefined;
    } | undefined;
}, {
    layer: string;
    at: {
        x: number;
        y: number;
        rotation?: number | undefined;
    };
    uuid: string;
    footprint: string;
    path?: string | undefined;
    descr?: string | undefined;
    tags?: string | undefined;
    properties?: {
        name: string;
        value: string;
        layer?: string | undefined;
        at?: {
            x: number;
            y: number;
            rotation?: number | undefined;
        } | undefined;
        uuid?: string | undefined;
        unlocked?: boolean | undefined;
        hide?: boolean | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }[] | undefined;
    sheetname?: string | undefined;
    sheetfile?: string | undefined;
    attr?: string | undefined;
    fp_lines?: {
        layer: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }[] | undefined;
    fp_texts?: {
        type: string;
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        text: string;
        uuid?: string | undefined;
        effects?: {
            font?: {
                thickness: number;
                size: [number, number];
            } | undefined;
        } | undefined;
    }[] | undefined;
    pads?: {
        number: string;
        type: "np_thru_hole" | "thru_hole" | "smd";
        layers: string[];
        at: [number, number];
        shape: "rect" | "roundrect" | "oval" | "circle";
        size: [number, number];
        uuid?: string | undefined;
        drill?: number | undefined;
        roundrect_rratio?: number | undefined;
        net?: {
            id: number;
            name?: string | undefined;
        } | undefined;
        pintype?: string | undefined;
    }[] | undefined;
    model?: {
        path: string;
        offset?: {
            xyz: [number, number, number];
        } | undefined;
        scale?: {
            xyz: [number, number, number];
        } | undefined;
        rotate?: {
            xyz: [number, number, number];
        } | undefined;
    } | undefined;
}>;
type ZodFootprint = z.infer<typeof FootprintSchema>;
declare const GrRectSchema: z.ZodObject<{
    start: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    end: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    stroke: z.ZodObject<{
        width: z.ZodNumber;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        width: number;
    }, {
        type: string;
        width: number;
    }>;
    fill: z.ZodString;
    layer: z.ZodString;
    uuid: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    layer: string;
    fill: string;
    start: [number, number];
    end: [number, number];
    stroke: {
        type: string;
        width: number;
    };
    uuid?: string | undefined;
}, {
    layer: string;
    fill: string;
    start: [number, number];
    end: [number, number];
    stroke: {
        type: string;
        width: number;
    };
    uuid?: string | undefined;
}>;
type ZodGrRect = z.infer<typeof GrRectSchema>;
declare const SegmentSchema: z.ZodObject<{
    start: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    end: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    width: z.ZodNumber;
    layer: z.ZodString;
    net: z.ZodNumber;
    uuid: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    width: number;
    layer: string;
    start: [number, number];
    end: [number, number];
    net: number;
    uuid?: string | undefined;
}, {
    width: number;
    layer: string;
    start: [number, number];
    end: [number, number];
    net: number;
    uuid?: string | undefined;
}>;
type ZodSegment = z.infer<typeof SegmentSchema>;
declare const ViaSchema: z.ZodObject<{
    at: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    size: z.ZodNumber;
    drill: z.ZodNumber;
    layers: z.ZodArray<z.ZodString, "many">;
    net: z.ZodNumber;
    uuid: z.ZodString;
}, "strip", z.ZodTypeAny, {
    layers: string[];
    at: [number, number];
    size: number;
    uuid: string;
    drill: number;
    net: number;
}, {
    layers: string[];
    at: [number, number];
    size: number;
    uuid: string;
    drill: number;
    net: number;
}>;
type ZodVia = z.infer<typeof ViaSchema>;
declare const KiCadPcbSchema: z.ZodObject<{
    version: z.ZodNumber;
    generator: z.ZodString;
    generator_version: z.ZodString;
    general: z.ZodObject<{
        thickness: z.ZodNumber;
        legacy_teardrops: z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">;
    }, "strip", z.ZodTypeAny, {
        thickness: number;
        legacy_teardrops: boolean;
    }, {
        thickness: number;
        legacy_teardrops: boolean | "yes" | "no";
    }>;
    paper: z.ZodString;
    layers: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        type: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
        id: number;
        description?: string | undefined;
    }, {
        type: string;
        name: string;
        id: number;
        description?: string | undefined;
    }>, "many">;
    setup: z.ZodObject<{
        pad_to_mask_clearance: z.ZodNumber;
        allow_soldermask_bridges_in_footprints: z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">;
        pcbplotparams: z.ZodObject<{
            layerselection: z.ZodOptional<z.ZodString>;
            plot_on_all_layers_selection: z.ZodString;
            disableapertmacros: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            usegerberextensions: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            usegerberattributes: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            usegerberadvancedattributes: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            creategerberjobfile: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            dashed_line_dash_ratio: z.ZodOptional<z.ZodNumber>;
            dashed_line_gap_ratio: z.ZodOptional<z.ZodNumber>;
            svgprecision: z.ZodNumber;
            plotframeref: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            viasonmask: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            mode: z.ZodOptional<z.ZodNumber>;
            useauxorigin: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            hpglpennumber: z.ZodNumber;
            hpglpenspeed: z.ZodOptional<z.ZodNumber>;
            hpglpendiameter: z.ZodOptional<z.ZodNumber>;
            pdf_front_fp_property_popups: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            pdf_back_fp_property_popups: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            dxfpolygonmode: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            dxfimperialunits: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            dxfusepcbnewfont: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            psnegative: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            psa4output: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            plotreference: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            plotvalue: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            plotfptext: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            plotinvisibletext: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            sketchpadsonfab: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            subtractmaskfromsilk: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            outputformat: z.ZodOptional<z.ZodNumber>;
            mirror: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodLiteral<"yes">, z.ZodLiteral<"no">, z.ZodBoolean]>, boolean, boolean | "yes" | "no">>;
            drillshape: z.ZodOptional<z.ZodNumber>;
            scaleselection: z.ZodOptional<z.ZodNumber>;
            outputdirectory: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            plot_on_all_layers_selection: string;
            svgprecision: number;
            hpglpennumber: number;
            layerselection?: string | undefined;
            disableapertmacros?: boolean | undefined;
            usegerberextensions?: boolean | undefined;
            usegerberattributes?: boolean | undefined;
            usegerberadvancedattributes?: boolean | undefined;
            creategerberjobfile?: boolean | undefined;
            plotframeref?: boolean | undefined;
            viasonmask?: boolean | undefined;
            mode?: number | undefined;
            useauxorigin?: boolean | undefined;
            hpglpenspeed?: number | undefined;
            hpglpendiameter?: number | undefined;
            dxfpolygonmode?: boolean | undefined;
            dxfimperialunits?: boolean | undefined;
            dxfusepcbnewfont?: boolean | undefined;
            psnegative?: boolean | undefined;
            psa4output?: boolean | undefined;
            plotreference?: boolean | undefined;
            plotvalue?: boolean | undefined;
            plotinvisibletext?: boolean | undefined;
            sketchpadsonfab?: boolean | undefined;
            subtractmaskfromsilk?: boolean | undefined;
            outputformat?: number | undefined;
            mirror?: boolean | undefined;
            drillshape?: number | undefined;
            scaleselection?: number | undefined;
            outputdirectory?: string | undefined;
            dashed_line_dash_ratio?: number | undefined;
            dashed_line_gap_ratio?: number | undefined;
            pdf_front_fp_property_popups?: boolean | undefined;
            pdf_back_fp_property_popups?: boolean | undefined;
            plotfptext?: boolean | undefined;
        }, {
            plot_on_all_layers_selection: string;
            svgprecision: number;
            hpglpennumber: number;
            layerselection?: string | undefined;
            disableapertmacros?: boolean | "yes" | "no" | undefined;
            usegerberextensions?: boolean | "yes" | "no" | undefined;
            usegerberattributes?: boolean | "yes" | "no" | undefined;
            usegerberadvancedattributes?: boolean | "yes" | "no" | undefined;
            creategerberjobfile?: boolean | "yes" | "no" | undefined;
            plotframeref?: boolean | "yes" | "no" | undefined;
            viasonmask?: boolean | "yes" | "no" | undefined;
            mode?: number | undefined;
            useauxorigin?: boolean | "yes" | "no" | undefined;
            hpglpenspeed?: number | undefined;
            hpglpendiameter?: number | undefined;
            dxfpolygonmode?: boolean | "yes" | "no" | undefined;
            dxfimperialunits?: boolean | "yes" | "no" | undefined;
            dxfusepcbnewfont?: boolean | "yes" | "no" | undefined;
            psnegative?: boolean | "yes" | "no" | undefined;
            psa4output?: boolean | "yes" | "no" | undefined;
            plotreference?: boolean | "yes" | "no" | undefined;
            plotvalue?: boolean | "yes" | "no" | undefined;
            plotinvisibletext?: boolean | "yes" | "no" | undefined;
            sketchpadsonfab?: boolean | "yes" | "no" | undefined;
            subtractmaskfromsilk?: boolean | "yes" | "no" | undefined;
            outputformat?: number | undefined;
            mirror?: boolean | "yes" | "no" | undefined;
            drillshape?: number | undefined;
            scaleselection?: number | undefined;
            outputdirectory?: string | undefined;
            dashed_line_dash_ratio?: number | undefined;
            dashed_line_gap_ratio?: number | undefined;
            pdf_front_fp_property_popups?: boolean | "yes" | "no" | undefined;
            pdf_back_fp_property_popups?: boolean | "yes" | "no" | undefined;
            plotfptext?: boolean | "yes" | "no" | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        pad_to_mask_clearance: number;
        allow_soldermask_bridges_in_footprints: boolean;
        pcbplotparams: {
            plot_on_all_layers_selection: string;
            svgprecision: number;
            hpglpennumber: number;
            layerselection?: string | undefined;
            disableapertmacros?: boolean | undefined;
            usegerberextensions?: boolean | undefined;
            usegerberattributes?: boolean | undefined;
            usegerberadvancedattributes?: boolean | undefined;
            creategerberjobfile?: boolean | undefined;
            plotframeref?: boolean | undefined;
            viasonmask?: boolean | undefined;
            mode?: number | undefined;
            useauxorigin?: boolean | undefined;
            hpglpenspeed?: number | undefined;
            hpglpendiameter?: number | undefined;
            dxfpolygonmode?: boolean | undefined;
            dxfimperialunits?: boolean | undefined;
            dxfusepcbnewfont?: boolean | undefined;
            psnegative?: boolean | undefined;
            psa4output?: boolean | undefined;
            plotreference?: boolean | undefined;
            plotvalue?: boolean | undefined;
            plotinvisibletext?: boolean | undefined;
            sketchpadsonfab?: boolean | undefined;
            subtractmaskfromsilk?: boolean | undefined;
            outputformat?: number | undefined;
            mirror?: boolean | undefined;
            drillshape?: number | undefined;
            scaleselection?: number | undefined;
            outputdirectory?: string | undefined;
            dashed_line_dash_ratio?: number | undefined;
            dashed_line_gap_ratio?: number | undefined;
            pdf_front_fp_property_popups?: boolean | undefined;
            pdf_back_fp_property_popups?: boolean | undefined;
            plotfptext?: boolean | undefined;
        };
    }, {
        pad_to_mask_clearance: number;
        allow_soldermask_bridges_in_footprints: boolean | "yes" | "no";
        pcbplotparams: {
            plot_on_all_layers_selection: string;
            svgprecision: number;
            hpglpennumber: number;
            layerselection?: string | undefined;
            disableapertmacros?: boolean | "yes" | "no" | undefined;
            usegerberextensions?: boolean | "yes" | "no" | undefined;
            usegerberattributes?: boolean | "yes" | "no" | undefined;
            usegerberadvancedattributes?: boolean | "yes" | "no" | undefined;
            creategerberjobfile?: boolean | "yes" | "no" | undefined;
            plotframeref?: boolean | "yes" | "no" | undefined;
            viasonmask?: boolean | "yes" | "no" | undefined;
            mode?: number | undefined;
            useauxorigin?: boolean | "yes" | "no" | undefined;
            hpglpenspeed?: number | undefined;
            hpglpendiameter?: number | undefined;
            dxfpolygonmode?: boolean | "yes" | "no" | undefined;
            dxfimperialunits?: boolean | "yes" | "no" | undefined;
            dxfusepcbnewfont?: boolean | "yes" | "no" | undefined;
            psnegative?: boolean | "yes" | "no" | undefined;
            psa4output?: boolean | "yes" | "no" | undefined;
            plotreference?: boolean | "yes" | "no" | undefined;
            plotvalue?: boolean | "yes" | "no" | undefined;
            plotinvisibletext?: boolean | "yes" | "no" | undefined;
            sketchpadsonfab?: boolean | "yes" | "no" | undefined;
            subtractmaskfromsilk?: boolean | "yes" | "no" | undefined;
            outputformat?: number | undefined;
            mirror?: boolean | "yes" | "no" | undefined;
            drillshape?: number | undefined;
            scaleselection?: number | undefined;
            outputdirectory?: string | undefined;
            dashed_line_dash_ratio?: number | undefined;
            dashed_line_gap_ratio?: number | undefined;
            pdf_front_fp_property_popups?: boolean | "yes" | "no" | undefined;
            pdf_back_fp_property_popups?: boolean | "yes" | "no" | undefined;
            plotfptext?: boolean | "yes" | "no" | undefined;
        };
    }>;
    nets: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: number;
    }, {
        name: string;
        id: number;
    }>, "many">;
    footprints: z.ZodArray<z.ZodObject<{
        footprint: z.ZodString;
        layer: z.ZodString;
        uuid: z.ZodString;
        at: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            rotation: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }>;
        descr: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodString>;
        properties: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
            at: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                rotation: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }>>;
            layer: z.ZodOptional<z.ZodString>;
            uuid: z.ZodOptional<z.ZodString>;
            unlocked: z.ZodOptional<z.ZodBoolean>;
            hide: z.ZodOptional<z.ZodBoolean>;
            effects: z.ZodOptional<z.ZodObject<{
                font: z.ZodOptional<z.ZodObject<{
                    size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
                    thickness: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    thickness: number;
                    size: [number, number];
                }, {
                    thickness: number;
                    size: [number, number];
                }>>;
            }, "strip", z.ZodTypeAny, {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            }, {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            value: string;
            layer?: string | undefined;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            uuid?: string | undefined;
            unlocked?: boolean | undefined;
            hide?: boolean | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }, {
            name: string;
            value: string;
            layer?: string | undefined;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            uuid?: string | undefined;
            unlocked?: boolean | undefined;
            hide?: boolean | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }>, "many">>;
        path: z.ZodOptional<z.ZodString>;
        sheetname: z.ZodOptional<z.ZodString>;
        sheetfile: z.ZodOptional<z.ZodString>;
        attr: z.ZodOptional<z.ZodString>;
        fp_lines: z.ZodOptional<z.ZodArray<z.ZodObject<{
            start: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            end: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            stroke: z.ZodObject<{
                width: z.ZodNumber;
                type: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                width: number;
            }, {
                type: string;
                width: number;
            }>;
            layer: z.ZodString;
            uuid: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            layer: string;
            start: [number, number];
            end: [number, number];
            stroke: {
                type: string;
                width: number;
            };
            uuid?: string | undefined;
        }, {
            layer: string;
            start: [number, number];
            end: [number, number];
            stroke: {
                type: string;
                width: number;
            };
            uuid?: string | undefined;
        }>, "many">>;
        fp_texts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            text: z.ZodString;
            at: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                rotation: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }>;
            layer: z.ZodString;
            uuid: z.ZodOptional<z.ZodString>;
            effects: z.ZodOptional<z.ZodObject<{
                font: z.ZodOptional<z.ZodObject<{
                    size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
                    thickness: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    thickness: number;
                    size: [number, number];
                }, {
                    thickness: number;
                    size: [number, number];
                }>>;
            }, "strip", z.ZodTypeAny, {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            }, {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            layer: string;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            text: string;
            uuid?: string | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }, {
            type: string;
            layer: string;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            text: string;
            uuid?: string | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }>, "many">>;
        pads: z.ZodOptional<z.ZodArray<z.ZodObject<{
            number: z.ZodString;
            type: z.ZodEnum<["thru_hole", "np_thru_hole", "smd"]>;
            shape: z.ZodEnum<["rect", "roundrect", "oval", "circle"]>;
            drill: z.ZodOptional<z.ZodNumber>;
            at: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            size: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            layers: z.ZodArray<z.ZodString, "many">;
            roundrect_rratio: z.ZodOptional<z.ZodNumber>;
            net: z.ZodOptional<z.ZodObject<{
                id: z.ZodNumber;
                name: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: number;
                name?: string | undefined;
            }, {
                id: number;
                name?: string | undefined;
            }>>;
            pintype: z.ZodOptional<z.ZodString>;
            uuid: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            number: string;
            type: "np_thru_hole" | "thru_hole" | "smd";
            layers: string[];
            at: [number, number];
            shape: "rect" | "roundrect" | "oval" | "circle";
            size: [number, number];
            uuid?: string | undefined;
            drill?: number | undefined;
            roundrect_rratio?: number | undefined;
            net?: {
                id: number;
                name?: string | undefined;
            } | undefined;
            pintype?: string | undefined;
        }, {
            number: string;
            type: "np_thru_hole" | "thru_hole" | "smd";
            layers: string[];
            at: [number, number];
            shape: "rect" | "roundrect" | "oval" | "circle";
            size: [number, number];
            uuid?: string | undefined;
            drill?: number | undefined;
            roundrect_rratio?: number | undefined;
            net?: {
                id: number;
                name?: string | undefined;
            } | undefined;
            pintype?: string | undefined;
        }>, "many">>;
        model: z.ZodOptional<z.ZodObject<{
            path: z.ZodString;
            offset: z.ZodOptional<z.ZodObject<{
                xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            }, "strip", z.ZodTypeAny, {
                xyz: [number, number, number];
            }, {
                xyz: [number, number, number];
            }>>;
            scale: z.ZodOptional<z.ZodObject<{
                xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            }, "strip", z.ZodTypeAny, {
                xyz: [number, number, number];
            }, {
                xyz: [number, number, number];
            }>>;
            rotate: z.ZodOptional<z.ZodObject<{
                xyz: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            }, "strip", z.ZodTypeAny, {
                xyz: [number, number, number];
            }, {
                xyz: [number, number, number];
            }>>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            offset?: {
                xyz: [number, number, number];
            } | undefined;
            scale?: {
                xyz: [number, number, number];
            } | undefined;
            rotate?: {
                xyz: [number, number, number];
            } | undefined;
        }, {
            path: string;
            offset?: {
                xyz: [number, number, number];
            } | undefined;
            scale?: {
                xyz: [number, number, number];
            } | undefined;
            rotate?: {
                xyz: [number, number, number];
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        uuid: string;
        footprint: string;
        path?: string | undefined;
        descr?: string | undefined;
        tags?: string | undefined;
        properties?: {
            name: string;
            value: string;
            layer?: string | undefined;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            uuid?: string | undefined;
            unlocked?: boolean | undefined;
            hide?: boolean | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        sheetname?: string | undefined;
        sheetfile?: string | undefined;
        attr?: string | undefined;
        fp_lines?: {
            layer: string;
            start: [number, number];
            end: [number, number];
            stroke: {
                type: string;
                width: number;
            };
            uuid?: string | undefined;
        }[] | undefined;
        fp_texts?: {
            type: string;
            layer: string;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            text: string;
            uuid?: string | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        pads?: {
            number: string;
            type: "np_thru_hole" | "thru_hole" | "smd";
            layers: string[];
            at: [number, number];
            shape: "rect" | "roundrect" | "oval" | "circle";
            size: [number, number];
            uuid?: string | undefined;
            drill?: number | undefined;
            roundrect_rratio?: number | undefined;
            net?: {
                id: number;
                name?: string | undefined;
            } | undefined;
            pintype?: string | undefined;
        }[] | undefined;
        model?: {
            path: string;
            offset?: {
                xyz: [number, number, number];
            } | undefined;
            scale?: {
                xyz: [number, number, number];
            } | undefined;
            rotate?: {
                xyz: [number, number, number];
            } | undefined;
        } | undefined;
    }, {
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        uuid: string;
        footprint: string;
        path?: string | undefined;
        descr?: string | undefined;
        tags?: string | undefined;
        properties?: {
            name: string;
            value: string;
            layer?: string | undefined;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            uuid?: string | undefined;
            unlocked?: boolean | undefined;
            hide?: boolean | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        sheetname?: string | undefined;
        sheetfile?: string | undefined;
        attr?: string | undefined;
        fp_lines?: {
            layer: string;
            start: [number, number];
            end: [number, number];
            stroke: {
                type: string;
                width: number;
            };
            uuid?: string | undefined;
        }[] | undefined;
        fp_texts?: {
            type: string;
            layer: string;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            text: string;
            uuid?: string | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        pads?: {
            number: string;
            type: "np_thru_hole" | "thru_hole" | "smd";
            layers: string[];
            at: [number, number];
            shape: "rect" | "roundrect" | "oval" | "circle";
            size: [number, number];
            uuid?: string | undefined;
            drill?: number | undefined;
            roundrect_rratio?: number | undefined;
            net?: {
                id: number;
                name?: string | undefined;
            } | undefined;
            pintype?: string | undefined;
        }[] | undefined;
        model?: {
            path: string;
            offset?: {
                xyz: [number, number, number];
            } | undefined;
            scale?: {
                xyz: [number, number, number];
            } | undefined;
            rotate?: {
                xyz: [number, number, number];
            } | undefined;
        } | undefined;
    }>, "many">;
    gr_rects: z.ZodArray<z.ZodObject<{
        start: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        end: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        stroke: z.ZodObject<{
            width: z.ZodNumber;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            width: number;
        }, {
            type: string;
            width: number;
        }>;
        fill: z.ZodString;
        layer: z.ZodString;
        uuid: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        layer: string;
        fill: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }, {
        layer: string;
        fill: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }>, "many">;
    segments: z.ZodArray<z.ZodObject<{
        start: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        end: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        width: z.ZodNumber;
        layer: z.ZodString;
        net: z.ZodNumber;
        uuid: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        width: number;
        layer: string;
        start: [number, number];
        end: [number, number];
        net: number;
        uuid?: string | undefined;
    }, {
        width: number;
        layer: string;
        start: [number, number];
        end: [number, number];
        net: number;
        uuid?: string | undefined;
    }>, "many">;
    vias: z.ZodArray<z.ZodObject<{
        at: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        size: z.ZodNumber;
        drill: z.ZodNumber;
        layers: z.ZodArray<z.ZodString, "many">;
        net: z.ZodNumber;
        uuid: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        layers: string[];
        at: [number, number];
        size: number;
        uuid: string;
        drill: number;
        net: number;
    }, {
        layers: string[];
        at: [number, number];
        size: number;
        uuid: string;
        drill: number;
        net: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: number;
    generator: string;
    generator_version: string;
    general: {
        thickness: number;
        legacy_teardrops: boolean;
    };
    paper: string;
    layers: {
        type: string;
        name: string;
        id: number;
        description?: string | undefined;
    }[];
    setup: {
        pad_to_mask_clearance: number;
        allow_soldermask_bridges_in_footprints: boolean;
        pcbplotparams: {
            plot_on_all_layers_selection: string;
            svgprecision: number;
            hpglpennumber: number;
            layerselection?: string | undefined;
            disableapertmacros?: boolean | undefined;
            usegerberextensions?: boolean | undefined;
            usegerberattributes?: boolean | undefined;
            usegerberadvancedattributes?: boolean | undefined;
            creategerberjobfile?: boolean | undefined;
            plotframeref?: boolean | undefined;
            viasonmask?: boolean | undefined;
            mode?: number | undefined;
            useauxorigin?: boolean | undefined;
            hpglpenspeed?: number | undefined;
            hpglpendiameter?: number | undefined;
            dxfpolygonmode?: boolean | undefined;
            dxfimperialunits?: boolean | undefined;
            dxfusepcbnewfont?: boolean | undefined;
            psnegative?: boolean | undefined;
            psa4output?: boolean | undefined;
            plotreference?: boolean | undefined;
            plotvalue?: boolean | undefined;
            plotinvisibletext?: boolean | undefined;
            sketchpadsonfab?: boolean | undefined;
            subtractmaskfromsilk?: boolean | undefined;
            outputformat?: number | undefined;
            mirror?: boolean | undefined;
            drillshape?: number | undefined;
            scaleselection?: number | undefined;
            outputdirectory?: string | undefined;
            dashed_line_dash_ratio?: number | undefined;
            dashed_line_gap_ratio?: number | undefined;
            pdf_front_fp_property_popups?: boolean | undefined;
            pdf_back_fp_property_popups?: boolean | undefined;
            plotfptext?: boolean | undefined;
        };
    };
    nets: {
        name: string;
        id: number;
    }[];
    footprints: {
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        uuid: string;
        footprint: string;
        path?: string | undefined;
        descr?: string | undefined;
        tags?: string | undefined;
        properties?: {
            name: string;
            value: string;
            layer?: string | undefined;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            uuid?: string | undefined;
            unlocked?: boolean | undefined;
            hide?: boolean | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        sheetname?: string | undefined;
        sheetfile?: string | undefined;
        attr?: string | undefined;
        fp_lines?: {
            layer: string;
            start: [number, number];
            end: [number, number];
            stroke: {
                type: string;
                width: number;
            };
            uuid?: string | undefined;
        }[] | undefined;
        fp_texts?: {
            type: string;
            layer: string;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            text: string;
            uuid?: string | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        pads?: {
            number: string;
            type: "np_thru_hole" | "thru_hole" | "smd";
            layers: string[];
            at: [number, number];
            shape: "rect" | "roundrect" | "oval" | "circle";
            size: [number, number];
            uuid?: string | undefined;
            drill?: number | undefined;
            roundrect_rratio?: number | undefined;
            net?: {
                id: number;
                name?: string | undefined;
            } | undefined;
            pintype?: string | undefined;
        }[] | undefined;
        model?: {
            path: string;
            offset?: {
                xyz: [number, number, number];
            } | undefined;
            scale?: {
                xyz: [number, number, number];
            } | undefined;
            rotate?: {
                xyz: [number, number, number];
            } | undefined;
        } | undefined;
    }[];
    segments: {
        width: number;
        layer: string;
        start: [number, number];
        end: [number, number];
        net: number;
        uuid?: string | undefined;
    }[];
    vias: {
        layers: string[];
        at: [number, number];
        size: number;
        uuid: string;
        drill: number;
        net: number;
    }[];
    gr_rects: {
        layer: string;
        fill: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }[];
}, {
    version: number;
    generator: string;
    generator_version: string;
    general: {
        thickness: number;
        legacy_teardrops: boolean | "yes" | "no";
    };
    paper: string;
    layers: {
        type: string;
        name: string;
        id: number;
        description?: string | undefined;
    }[];
    setup: {
        pad_to_mask_clearance: number;
        allow_soldermask_bridges_in_footprints: boolean | "yes" | "no";
        pcbplotparams: {
            plot_on_all_layers_selection: string;
            svgprecision: number;
            hpglpennumber: number;
            layerselection?: string | undefined;
            disableapertmacros?: boolean | "yes" | "no" | undefined;
            usegerberextensions?: boolean | "yes" | "no" | undefined;
            usegerberattributes?: boolean | "yes" | "no" | undefined;
            usegerberadvancedattributes?: boolean | "yes" | "no" | undefined;
            creategerberjobfile?: boolean | "yes" | "no" | undefined;
            plotframeref?: boolean | "yes" | "no" | undefined;
            viasonmask?: boolean | "yes" | "no" | undefined;
            mode?: number | undefined;
            useauxorigin?: boolean | "yes" | "no" | undefined;
            hpglpenspeed?: number | undefined;
            hpglpendiameter?: number | undefined;
            dxfpolygonmode?: boolean | "yes" | "no" | undefined;
            dxfimperialunits?: boolean | "yes" | "no" | undefined;
            dxfusepcbnewfont?: boolean | "yes" | "no" | undefined;
            psnegative?: boolean | "yes" | "no" | undefined;
            psa4output?: boolean | "yes" | "no" | undefined;
            plotreference?: boolean | "yes" | "no" | undefined;
            plotvalue?: boolean | "yes" | "no" | undefined;
            plotinvisibletext?: boolean | "yes" | "no" | undefined;
            sketchpadsonfab?: boolean | "yes" | "no" | undefined;
            subtractmaskfromsilk?: boolean | "yes" | "no" | undefined;
            outputformat?: number | undefined;
            mirror?: boolean | "yes" | "no" | undefined;
            drillshape?: number | undefined;
            scaleselection?: number | undefined;
            outputdirectory?: string | undefined;
            dashed_line_dash_ratio?: number | undefined;
            dashed_line_gap_ratio?: number | undefined;
            pdf_front_fp_property_popups?: boolean | "yes" | "no" | undefined;
            pdf_back_fp_property_popups?: boolean | "yes" | "no" | undefined;
            plotfptext?: boolean | "yes" | "no" | undefined;
        };
    };
    nets: {
        name: string;
        id: number;
    }[];
    footprints: {
        layer: string;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        uuid: string;
        footprint: string;
        path?: string | undefined;
        descr?: string | undefined;
        tags?: string | undefined;
        properties?: {
            name: string;
            value: string;
            layer?: string | undefined;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            uuid?: string | undefined;
            unlocked?: boolean | undefined;
            hide?: boolean | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        sheetname?: string | undefined;
        sheetfile?: string | undefined;
        attr?: string | undefined;
        fp_lines?: {
            layer: string;
            start: [number, number];
            end: [number, number];
            stroke: {
                type: string;
                width: number;
            };
            uuid?: string | undefined;
        }[] | undefined;
        fp_texts?: {
            type: string;
            layer: string;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            text: string;
            uuid?: string | undefined;
            effects?: {
                font?: {
                    thickness: number;
                    size: [number, number];
                } | undefined;
            } | undefined;
        }[] | undefined;
        pads?: {
            number: string;
            type: "np_thru_hole" | "thru_hole" | "smd";
            layers: string[];
            at: [number, number];
            shape: "rect" | "roundrect" | "oval" | "circle";
            size: [number, number];
            uuid?: string | undefined;
            drill?: number | undefined;
            roundrect_rratio?: number | undefined;
            net?: {
                id: number;
                name?: string | undefined;
            } | undefined;
            pintype?: string | undefined;
        }[] | undefined;
        model?: {
            path: string;
            offset?: {
                xyz: [number, number, number];
            } | undefined;
            scale?: {
                xyz: [number, number, number];
            } | undefined;
            rotate?: {
                xyz: [number, number, number];
            } | undefined;
        } | undefined;
    }[];
    segments: {
        width: number;
        layer: string;
        start: [number, number];
        end: [number, number];
        net: number;
        uuid?: string | undefined;
    }[];
    vias: {
        layers: string[];
        at: [number, number];
        size: number;
        uuid: string;
        drill: number;
        net: number;
    }[];
    gr_rects: {
        layer: string;
        fill: string;
        start: [number, number];
        end: [number, number];
        stroke: {
            type: string;
            width: number;
        };
        uuid?: string | undefined;
    }[];
}>;
type ZodKiCadPcb = z.infer<typeof KiCadPcbSchema>;

interface KicadProject {
    board: Board;
    boards: any[];
    cvpcb: CvPcb;
    erc: Erc;
    libraries: Libraries;
    meta: Meta;
    net_settings: NetSettings;
    pcbnew: PcbNew;
    schematic: Schematic;
    sheets: [string, string][];
    text_variables: any;
}
interface Board {
    "3dviewports": any[];
    design_settings: DesignSettings;
    ipc2581: Ipc2581;
    layer_presets: any[];
    viewports: any[];
}
interface DesignSettings {
    defaults: Defaults;
    diff_pair_dimensions: any[];
    drc_exclusions: any[];
    meta: {
        version: number;
    };
    rule_severities: {
        [key: string]: string;
    };
    rules: Rules;
    teardrop_options: TeardropOption[];
    teardrop_parameters: TeardropParameter[];
    track_widths: any[];
    tuning_pattern_settings: TuningPatternSettings;
    via_dimensions: any[];
    zones_allow_external_fillets: boolean;
}
interface Defaults {
    apply_defaults_to_fp_fields: boolean;
    apply_defaults_to_fp_shapes: boolean;
    apply_defaults_to_fp_text: boolean;
    board_outline_line_width: number;
    copper_line_width: number;
    copper_text_italic: boolean;
    copper_text_size_h: number;
    copper_text_size_v: number;
    copper_text_thickness: number;
    copper_text_upright: boolean;
    courtyard_line_width: number;
    dimension_precision: number;
    dimension_units: number;
    dimensions: Dimensions;
    fab_line_width: number;
    fab_text_italic: boolean;
    fab_text_size_h: number;
    fab_text_size_v: number;
    fab_text_thickness: number;
    fab_text_upright: boolean;
    other_line_width: number;
    other_text_italic: boolean;
    other_text_size_h: number;
    other_text_size_v: number;
    other_text_thickness: number;
    other_text_upright: boolean;
    pads: Pads;
    silk_line_width: number;
    silk_text_italic: boolean;
    silk_text_size_h: number;
    silk_text_size_v: number;
    silk_text_thickness: number;
    silk_text_upright: boolean;
    zones: Zones;
}
interface Dimensions {
    arrow_length: number;
    extension_offset: number;
    keep_text_aligned: boolean;
    suppress_zeroes: boolean;
    text_position: number;
    units_format: number;
}
interface Pads {
    drill: number;
    height: number;
    width: number;
}
interface Zones {
    min_clearance: number;
}
interface Rules {
    max_error: number;
    min_clearance: number;
    min_connection: number;
    min_copper_edge_clearance: number;
    min_hole_clearance: number;
    min_hole_to_hole: number;
    min_microvia_diameter: number;
    min_microvia_drill: number;
    min_resolved_spokes: number;
    min_silk_clearance: number;
    min_text_height: number;
    min_text_thickness: number;
    min_through_hole_diameter: number;
    min_track_width: number;
    min_via_annular_width: number;
    min_via_diameter: number;
    solder_mask_to_copper_clearance: number;
    use_height_for_length_calcs: boolean;
}
interface TeardropOption {
    td_onpadsmd: boolean;
    td_onroundshapesonly: boolean;
    td_ontrackend: boolean;
    td_onviapad: boolean;
}
interface TeardropParameter {
    td_allow_use_two_tracks: boolean;
    td_curve_segcount: number;
    td_height_ratio: number;
    td_length_ratio: number;
    td_maxheight: number;
    td_maxlen: number;
    td_on_pad_in_zone: boolean;
    td_target_name: string;
    td_width_to_size_filter_ratio: number;
}
interface TuningPatternSettings {
    diff_pair_defaults: TuningPatternDefaults;
    diff_pair_skew_defaults: TuningPatternDefaults;
    single_track_defaults: TuningPatternDefaults;
}
interface TuningPatternDefaults {
    corner_radius_percentage: number;
    corner_style: number;
    max_amplitude: number;
    min_amplitude: number;
    single_sided: boolean;
    spacing: number;
}
interface Ipc2581 {
    dist: string;
    distpn: string;
    internal_id: string;
    mfg: string;
    mpn: string;
}
interface CvPcb {
    equivalence_files: any[];
}
interface Erc {
    erc_exclusions: any[];
    meta: {
        version: number;
    };
    pin_map: number[][];
    rule_severities: {
        [key: string]: string;
    };
}
interface Libraries {
    pinned_footprint_libs: any[];
    pinned_symbol_libs: any[];
}
interface Meta {
    filename: string;
    version: number;
}
interface NetSettings {
    classes: NetClass[];
    meta: {
        version: number;
    };
    net_colors: any;
    netclass_assignments: any;
    netclass_patterns: any[];
}
interface NetClass {
    bus_width: number;
    clearance: number;
    diff_pair_gap: number;
    diff_pair_via_gap: number;
    diff_pair_width: number;
    line_style: number;
    microvia_diameter: number;
    microvia_drill: number;
    name: string;
    pcb_color: string;
    schematic_color: string;
    track_width: number;
    via_diameter: number;
    via_drill: number;
    wire_width: number;
}
interface PcbNew {
    last_paths: LastPaths;
    page_layout_descr_file: string;
}
interface LastPaths {
    gencad: string;
    idf: string;
    netlist: string;
    plot: string;
    pos_files: string;
    specctra_dsn: string;
    step: string;
    svg: string;
    vrml: string;
}
interface Schematic {
    annotate_start_num: number;
    bom_export_filename: string;
    bom_fmt_presets: any[];
    bom_fmt_settings: BomFormatSettings;
    bom_presets: any[];
    bom_settings: BomSettings;
    connection_grid_size: number;
    drawing: Drawing;
    legacy_lib_dir: string;
    legacy_lib_list: any[];
    meta: {
        version: number;
    };
    net_format_name: string;
    page_layout_descr_file: string;
    plot_directory: string;
    spice_current_sheet_as_root: boolean;
    spice_external_command: string;
    spice_model_current_sheet_as_root: boolean;
    spice_save_all_currents: boolean;
    spice_save_all_dissipations: boolean;
    spice_save_all_voltages: boolean;
    subpart_first_id: number;
    subpart_id_separator: number;
}
interface BomFormatSettings {
    field_delimiter: string;
    keep_line_breaks: boolean;
    keep_tabs: boolean;
    name: string;
    ref_delimiter: string;
    ref_range_delimiter: string;
    string_delimiter: string;
}
interface BomSettings {
    exclude_dnp: boolean;
    fields_ordered: BomField[];
    filter_string: string;
    group_symbols: boolean;
    name: string;
    sort_asc: boolean;
    sort_field: string;
}
interface BomField {
    group_by: boolean;
    label: string;
    name: string;
    show: boolean;
}
interface Drawing {
    dashed_lines_dash_length_ratio: number;
    dashed_lines_gap_length_ratio: number;
    default_line_thickness: number;
    default_text_size: number;
    field_names: any[];
    intersheets_ref_own_page: boolean;
    intersheets_ref_prefix: string;
    intersheets_ref_short: boolean;
    intersheets_ref_show: boolean;
    intersheets_ref_suffix: string;
    junction_size_choice: number;
    label_size_ratio: number;
    operating_point_overlay_i_precision: number;
    operating_point_overlay_i_range: string;
    operating_point_overlay_v_precision: number;
    operating_point_overlay_v_range: string;
    overbar_offset_ratio: number;
    pin_symbol_size: number;
    text_offset_ratio: number;
}

declare function convertCircuitJsonToKicadPro(circuitJson: AnyCircuitElement[]): KicadProject;

declare const DimensionsSchema: z.ZodObject<{
    arrow_length: z.ZodNumber;
    extension_offset: z.ZodNumber;
    keep_text_aligned: z.ZodBoolean;
    suppress_zeroes: z.ZodBoolean;
    text_position: z.ZodNumber;
    units_format: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    arrow_length: number;
    extension_offset: number;
    keep_text_aligned: boolean;
    suppress_zeroes: boolean;
    text_position: number;
    units_format: number;
}, {
    arrow_length: number;
    extension_offset: number;
    keep_text_aligned: boolean;
    suppress_zeroes: boolean;
    text_position: number;
    units_format: number;
}>;
declare const PadsSchema: z.ZodObject<{
    drill: z.ZodNumber;
    height: z.ZodNumber;
    width: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    width: number;
    drill: number;
    height: number;
}, {
    width: number;
    drill: number;
    height: number;
}>;
declare const ZonesSchema: z.ZodObject<{
    min_clearance: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    min_clearance: number;
}, {
    min_clearance: number;
}>;
declare const RulesSchema: z.ZodObject<{
    max_error: z.ZodNumber;
    min_clearance: z.ZodNumber;
    min_connection: z.ZodNumber;
    min_copper_edge_clearance: z.ZodNumber;
    min_hole_clearance: z.ZodNumber;
    min_hole_to_hole: z.ZodNumber;
    min_microvia_diameter: z.ZodNumber;
    min_microvia_drill: z.ZodNumber;
    min_resolved_spokes: z.ZodNumber;
    min_silk_clearance: z.ZodNumber;
    min_text_height: z.ZodNumber;
    min_text_thickness: z.ZodNumber;
    min_through_hole_diameter: z.ZodNumber;
    min_track_width: z.ZodNumber;
    min_via_annular_width: z.ZodNumber;
    min_via_diameter: z.ZodNumber;
    solder_mask_to_copper_clearance: z.ZodNumber;
    use_height_for_length_calcs: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    min_clearance: number;
    max_error: number;
    min_connection: number;
    min_copper_edge_clearance: number;
    min_hole_clearance: number;
    min_hole_to_hole: number;
    min_microvia_diameter: number;
    min_microvia_drill: number;
    min_resolved_spokes: number;
    min_silk_clearance: number;
    min_text_height: number;
    min_text_thickness: number;
    min_through_hole_diameter: number;
    min_track_width: number;
    min_via_annular_width: number;
    min_via_diameter: number;
    solder_mask_to_copper_clearance: number;
    use_height_for_length_calcs: boolean;
}, {
    min_clearance: number;
    max_error: number;
    min_connection: number;
    min_copper_edge_clearance: number;
    min_hole_clearance: number;
    min_hole_to_hole: number;
    min_microvia_diameter: number;
    min_microvia_drill: number;
    min_resolved_spokes: number;
    min_silk_clearance: number;
    min_text_height: number;
    min_text_thickness: number;
    min_through_hole_diameter: number;
    min_track_width: number;
    min_via_annular_width: number;
    min_via_diameter: number;
    solder_mask_to_copper_clearance: number;
    use_height_for_length_calcs: boolean;
}>;
declare const TeardropOptionSchema: z.ZodObject<{
    td_onpadsmd: z.ZodBoolean;
    td_onroundshapesonly: z.ZodBoolean;
    td_ontrackend: z.ZodBoolean;
    td_onviapad: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    td_onpadsmd: boolean;
    td_onroundshapesonly: boolean;
    td_ontrackend: boolean;
    td_onviapad: boolean;
}, {
    td_onpadsmd: boolean;
    td_onroundshapesonly: boolean;
    td_ontrackend: boolean;
    td_onviapad: boolean;
}>;
declare const TeardropParameterSchema: z.ZodObject<{
    td_allow_use_two_tracks: z.ZodBoolean;
    td_curve_segcount: z.ZodNumber;
    td_height_ratio: z.ZodNumber;
    td_length_ratio: z.ZodNumber;
    td_maxheight: z.ZodNumber;
    td_maxlen: z.ZodNumber;
    td_on_pad_in_zone: z.ZodBoolean;
    td_target_name: z.ZodString;
    td_width_to_size_filter_ratio: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    td_allow_use_two_tracks: boolean;
    td_curve_segcount: number;
    td_height_ratio: number;
    td_length_ratio: number;
    td_maxheight: number;
    td_maxlen: number;
    td_on_pad_in_zone: boolean;
    td_target_name: string;
    td_width_to_size_filter_ratio: number;
}, {
    td_allow_use_two_tracks: boolean;
    td_curve_segcount: number;
    td_height_ratio: number;
    td_length_ratio: number;
    td_maxheight: number;
    td_maxlen: number;
    td_on_pad_in_zone: boolean;
    td_target_name: string;
    td_width_to_size_filter_ratio: number;
}>;
declare const TuningPatternDefaultsSchema: z.ZodObject<{
    corner_radius_percentage: z.ZodNumber;
    corner_style: z.ZodNumber;
    max_amplitude: z.ZodNumber;
    min_amplitude: z.ZodNumber;
    single_sided: z.ZodBoolean;
    spacing: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    corner_radius_percentage: number;
    corner_style: number;
    max_amplitude: number;
    min_amplitude: number;
    single_sided: boolean;
    spacing: number;
}, {
    corner_radius_percentage: number;
    corner_style: number;
    max_amplitude: number;
    min_amplitude: number;
    single_sided: boolean;
    spacing: number;
}>;
declare const TuningPatternSettingsSchema: z.ZodObject<{
    diff_pair_defaults: z.ZodObject<{
        corner_radius_percentage: z.ZodNumber;
        corner_style: z.ZodNumber;
        max_amplitude: z.ZodNumber;
        min_amplitude: z.ZodNumber;
        single_sided: z.ZodBoolean;
        spacing: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    }, {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    }>;
    diff_pair_skew_defaults: z.ZodObject<{
        corner_radius_percentage: z.ZodNumber;
        corner_style: z.ZodNumber;
        max_amplitude: z.ZodNumber;
        min_amplitude: z.ZodNumber;
        single_sided: z.ZodBoolean;
        spacing: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    }, {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    }>;
    single_track_defaults: z.ZodObject<{
        corner_radius_percentage: z.ZodNumber;
        corner_style: z.ZodNumber;
        max_amplitude: z.ZodNumber;
        min_amplitude: z.ZodNumber;
        single_sided: z.ZodBoolean;
        spacing: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    }, {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    }>;
}, "strip", z.ZodTypeAny, {
    diff_pair_defaults: {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    };
    diff_pair_skew_defaults: {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    };
    single_track_defaults: {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    };
}, {
    diff_pair_defaults: {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    };
    diff_pair_skew_defaults: {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    };
    single_track_defaults: {
        corner_radius_percentage: number;
        corner_style: number;
        max_amplitude: number;
        min_amplitude: number;
        single_sided: boolean;
        spacing: number;
    };
}>;
declare const Ipc2581Schema: z.ZodObject<{
    dist: z.ZodString;
    distpn: z.ZodString;
    internal_id: z.ZodString;
    mfg: z.ZodString;
    mpn: z.ZodString;
}, "strip", z.ZodTypeAny, {
    dist: string;
    distpn: string;
    internal_id: string;
    mfg: string;
    mpn: string;
}, {
    dist: string;
    distpn: string;
    internal_id: string;
    mfg: string;
    mpn: string;
}>;
declare const CvPcbSchema: z.ZodObject<{
    equivalence_files: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    equivalence_files: any[];
}, {
    equivalence_files: any[];
}>;
declare const ErcSchema: z.ZodObject<{
    erc_exclusions: z.ZodArray<z.ZodAny, "many">;
    meta: z.ZodObject<{
        version: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        version: number;
    }, {
        version: number;
    }>;
    pin_map: z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
    rule_severities: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    erc_exclusions: any[];
    meta: {
        version: number;
    };
    pin_map: number[][];
    rule_severities: Record<string, string>;
}, {
    erc_exclusions: any[];
    meta: {
        version: number;
    };
    pin_map: number[][];
    rule_severities: Record<string, string>;
}>;
declare const LibrariesSchema: z.ZodObject<{
    pinned_footprint_libs: z.ZodArray<z.ZodAny, "many">;
    pinned_symbol_libs: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    pinned_footprint_libs: any[];
    pinned_symbol_libs: any[];
}, {
    pinned_footprint_libs: any[];
    pinned_symbol_libs: any[];
}>;
declare const MetaSchema: z.ZodObject<{
    filename: z.ZodString;
    version: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    version: number;
    filename: string;
}, {
    version: number;
    filename: string;
}>;
declare const NetClassSchema: z.ZodObject<{
    bus_width: z.ZodNumber;
    clearance: z.ZodNumber;
    diff_pair_gap: z.ZodNumber;
    diff_pair_via_gap: z.ZodNumber;
    diff_pair_width: z.ZodNumber;
    line_style: z.ZodNumber;
    microvia_diameter: z.ZodNumber;
    microvia_drill: z.ZodNumber;
    name: z.ZodString;
    pcb_color: z.ZodString;
    schematic_color: z.ZodString;
    track_width: z.ZodNumber;
    via_diameter: z.ZodNumber;
    via_drill: z.ZodNumber;
    wire_width: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    clearance: number;
    track_width: number;
    bus_width: number;
    diff_pair_gap: number;
    diff_pair_via_gap: number;
    diff_pair_width: number;
    line_style: number;
    microvia_diameter: number;
    microvia_drill: number;
    pcb_color: string;
    schematic_color: string;
    via_diameter: number;
    via_drill: number;
    wire_width: number;
}, {
    name: string;
    clearance: number;
    track_width: number;
    bus_width: number;
    diff_pair_gap: number;
    diff_pair_via_gap: number;
    diff_pair_width: number;
    line_style: number;
    microvia_diameter: number;
    microvia_drill: number;
    pcb_color: string;
    schematic_color: string;
    via_diameter: number;
    via_drill: number;
    wire_width: number;
}>;
declare const NetSettingsSchema: z.ZodObject<{
    classes: z.ZodArray<z.ZodObject<{
        bus_width: z.ZodNumber;
        clearance: z.ZodNumber;
        diff_pair_gap: z.ZodNumber;
        diff_pair_via_gap: z.ZodNumber;
        diff_pair_width: z.ZodNumber;
        line_style: z.ZodNumber;
        microvia_diameter: z.ZodNumber;
        microvia_drill: z.ZodNumber;
        name: z.ZodString;
        pcb_color: z.ZodString;
        schematic_color: z.ZodString;
        track_width: z.ZodNumber;
        via_diameter: z.ZodNumber;
        via_drill: z.ZodNumber;
        wire_width: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        clearance: number;
        track_width: number;
        bus_width: number;
        diff_pair_gap: number;
        diff_pair_via_gap: number;
        diff_pair_width: number;
        line_style: number;
        microvia_diameter: number;
        microvia_drill: number;
        pcb_color: string;
        schematic_color: string;
        via_diameter: number;
        via_drill: number;
        wire_width: number;
    }, {
        name: string;
        clearance: number;
        track_width: number;
        bus_width: number;
        diff_pair_gap: number;
        diff_pair_via_gap: number;
        diff_pair_width: number;
        line_style: number;
        microvia_diameter: number;
        microvia_drill: number;
        pcb_color: string;
        schematic_color: string;
        via_diameter: number;
        via_drill: number;
        wire_width: number;
    }>, "many">;
    meta: z.ZodObject<{
        version: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        version: number;
    }, {
        version: number;
    }>;
    net_colors: z.ZodAny;
    netclass_assignments: z.ZodAny;
    netclass_patterns: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    meta: {
        version: number;
    };
    classes: {
        name: string;
        clearance: number;
        track_width: number;
        bus_width: number;
        diff_pair_gap: number;
        diff_pair_via_gap: number;
        diff_pair_width: number;
        line_style: number;
        microvia_diameter: number;
        microvia_drill: number;
        pcb_color: string;
        schematic_color: string;
        via_diameter: number;
        via_drill: number;
        wire_width: number;
    }[];
    netclass_patterns: any[];
    net_colors?: any;
    netclass_assignments?: any;
}, {
    meta: {
        version: number;
    };
    classes: {
        name: string;
        clearance: number;
        track_width: number;
        bus_width: number;
        diff_pair_gap: number;
        diff_pair_via_gap: number;
        diff_pair_width: number;
        line_style: number;
        microvia_diameter: number;
        microvia_drill: number;
        pcb_color: string;
        schematic_color: string;
        via_diameter: number;
        via_drill: number;
        wire_width: number;
    }[];
    netclass_patterns: any[];
    net_colors?: any;
    netclass_assignments?: any;
}>;
declare const LastPathsSchema: z.ZodObject<{
    gencad: z.ZodString;
    idf: z.ZodString;
    netlist: z.ZodString;
    plot: z.ZodString;
    pos_files: z.ZodString;
    specctra_dsn: z.ZodString;
    step: z.ZodString;
    svg: z.ZodString;
    vrml: z.ZodString;
}, "strip", z.ZodTypeAny, {
    gencad: string;
    idf: string;
    netlist: string;
    plot: string;
    pos_files: string;
    specctra_dsn: string;
    step: string;
    svg: string;
    vrml: string;
}, {
    gencad: string;
    idf: string;
    netlist: string;
    plot: string;
    pos_files: string;
    specctra_dsn: string;
    step: string;
    svg: string;
    vrml: string;
}>;
declare const PcbNewSchema: z.ZodObject<{
    last_paths: z.ZodObject<{
        gencad: z.ZodString;
        idf: z.ZodString;
        netlist: z.ZodString;
        plot: z.ZodString;
        pos_files: z.ZodString;
        specctra_dsn: z.ZodString;
        step: z.ZodString;
        svg: z.ZodString;
        vrml: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        gencad: string;
        idf: string;
        netlist: string;
        plot: string;
        pos_files: string;
        specctra_dsn: string;
        step: string;
        svg: string;
        vrml: string;
    }, {
        gencad: string;
        idf: string;
        netlist: string;
        plot: string;
        pos_files: string;
        specctra_dsn: string;
        step: string;
        svg: string;
        vrml: string;
    }>;
    page_layout_descr_file: z.ZodString;
}, "strip", z.ZodTypeAny, {
    last_paths: {
        gencad: string;
        idf: string;
        netlist: string;
        plot: string;
        pos_files: string;
        specctra_dsn: string;
        step: string;
        svg: string;
        vrml: string;
    };
    page_layout_descr_file: string;
}, {
    last_paths: {
        gencad: string;
        idf: string;
        netlist: string;
        plot: string;
        pos_files: string;
        specctra_dsn: string;
        step: string;
        svg: string;
        vrml: string;
    };
    page_layout_descr_file: string;
}>;
declare const BomFormatSettingsSchema: z.ZodObject<{
    field_delimiter: z.ZodString;
    keep_line_breaks: z.ZodBoolean;
    keep_tabs: z.ZodBoolean;
    name: z.ZodString;
    ref_delimiter: z.ZodString;
    ref_range_delimiter: z.ZodString;
    string_delimiter: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    field_delimiter: string;
    keep_line_breaks: boolean;
    keep_tabs: boolean;
    ref_delimiter: string;
    ref_range_delimiter: string;
    string_delimiter: string;
}, {
    name: string;
    field_delimiter: string;
    keep_line_breaks: boolean;
    keep_tabs: boolean;
    ref_delimiter: string;
    ref_range_delimiter: string;
    string_delimiter: string;
}>;
declare const BomFieldSchema: z.ZodObject<{
    group_by: z.ZodBoolean;
    label: z.ZodString;
    name: z.ZodString;
    show: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    group_by: boolean;
    label: string;
    show: boolean;
}, {
    name: string;
    group_by: boolean;
    label: string;
    show: boolean;
}>;
declare const BomSettingsSchema: z.ZodObject<{
    exclude_dnp: z.ZodBoolean;
    fields_ordered: z.ZodArray<z.ZodObject<{
        group_by: z.ZodBoolean;
        label: z.ZodString;
        name: z.ZodString;
        show: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        name: string;
        group_by: boolean;
        label: string;
        show: boolean;
    }, {
        name: string;
        group_by: boolean;
        label: string;
        show: boolean;
    }>, "many">;
    filter_string: z.ZodString;
    group_symbols: z.ZodBoolean;
    name: z.ZodString;
    sort_asc: z.ZodBoolean;
    sort_field: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    exclude_dnp: boolean;
    fields_ordered: {
        name: string;
        group_by: boolean;
        label: string;
        show: boolean;
    }[];
    filter_string: string;
    group_symbols: boolean;
    sort_asc: boolean;
    sort_field: string;
}, {
    name: string;
    exclude_dnp: boolean;
    fields_ordered: {
        name: string;
        group_by: boolean;
        label: string;
        show: boolean;
    }[];
    filter_string: string;
    group_symbols: boolean;
    sort_asc: boolean;
    sort_field: string;
}>;
declare const DrawingSchema: z.ZodObject<{
    dashed_lines_dash_length_ratio: z.ZodNumber;
    dashed_lines_gap_length_ratio: z.ZodNumber;
    default_line_thickness: z.ZodNumber;
    default_text_size: z.ZodNumber;
    field_names: z.ZodArray<z.ZodAny, "many">;
    intersheets_ref_own_page: z.ZodBoolean;
    intersheets_ref_prefix: z.ZodString;
    intersheets_ref_short: z.ZodBoolean;
    intersheets_ref_show: z.ZodBoolean;
    intersheets_ref_suffix: z.ZodString;
    junction_size_choice: z.ZodNumber;
    label_size_ratio: z.ZodNumber;
    operating_point_overlay_i_precision: z.ZodNumber;
    operating_point_overlay_i_range: z.ZodString;
    operating_point_overlay_v_precision: z.ZodNumber;
    operating_point_overlay_v_range: z.ZodString;
    overbar_offset_ratio: z.ZodNumber;
    pin_symbol_size: z.ZodNumber;
    text_offset_ratio: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    dashed_lines_dash_length_ratio: number;
    dashed_lines_gap_length_ratio: number;
    default_line_thickness: number;
    default_text_size: number;
    field_names: any[];
    intersheets_ref_own_page: boolean;
    intersheets_ref_prefix: string;
    intersheets_ref_short: boolean;
    intersheets_ref_show: boolean;
    intersheets_ref_suffix: string;
    junction_size_choice: number;
    label_size_ratio: number;
    operating_point_overlay_i_precision: number;
    operating_point_overlay_i_range: string;
    operating_point_overlay_v_precision: number;
    operating_point_overlay_v_range: string;
    overbar_offset_ratio: number;
    pin_symbol_size: number;
    text_offset_ratio: number;
}, {
    dashed_lines_dash_length_ratio: number;
    dashed_lines_gap_length_ratio: number;
    default_line_thickness: number;
    default_text_size: number;
    field_names: any[];
    intersheets_ref_own_page: boolean;
    intersheets_ref_prefix: string;
    intersheets_ref_short: boolean;
    intersheets_ref_show: boolean;
    intersheets_ref_suffix: string;
    junction_size_choice: number;
    label_size_ratio: number;
    operating_point_overlay_i_precision: number;
    operating_point_overlay_i_range: string;
    operating_point_overlay_v_precision: number;
    operating_point_overlay_v_range: string;
    overbar_offset_ratio: number;
    pin_symbol_size: number;
    text_offset_ratio: number;
}>;
declare const SchematicSchema: z.ZodObject<{
    annotate_start_num: z.ZodNumber;
    bom_export_filename: z.ZodString;
    bom_fmt_presets: z.ZodArray<z.ZodAny, "many">;
    bom_fmt_settings: z.ZodObject<{
        field_delimiter: z.ZodString;
        keep_line_breaks: z.ZodBoolean;
        keep_tabs: z.ZodBoolean;
        name: z.ZodString;
        ref_delimiter: z.ZodString;
        ref_range_delimiter: z.ZodString;
        string_delimiter: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        field_delimiter: string;
        keep_line_breaks: boolean;
        keep_tabs: boolean;
        ref_delimiter: string;
        ref_range_delimiter: string;
        string_delimiter: string;
    }, {
        name: string;
        field_delimiter: string;
        keep_line_breaks: boolean;
        keep_tabs: boolean;
        ref_delimiter: string;
        ref_range_delimiter: string;
        string_delimiter: string;
    }>;
    bom_presets: z.ZodArray<z.ZodAny, "many">;
    bom_settings: z.ZodObject<{
        exclude_dnp: z.ZodBoolean;
        fields_ordered: z.ZodArray<z.ZodObject<{
            group_by: z.ZodBoolean;
            label: z.ZodString;
            name: z.ZodString;
            show: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            name: string;
            group_by: boolean;
            label: string;
            show: boolean;
        }, {
            name: string;
            group_by: boolean;
            label: string;
            show: boolean;
        }>, "many">;
        filter_string: z.ZodString;
        group_symbols: z.ZodBoolean;
        name: z.ZodString;
        sort_asc: z.ZodBoolean;
        sort_field: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        exclude_dnp: boolean;
        fields_ordered: {
            name: string;
            group_by: boolean;
            label: string;
            show: boolean;
        }[];
        filter_string: string;
        group_symbols: boolean;
        sort_asc: boolean;
        sort_field: string;
    }, {
        name: string;
        exclude_dnp: boolean;
        fields_ordered: {
            name: string;
            group_by: boolean;
            label: string;
            show: boolean;
        }[];
        filter_string: string;
        group_symbols: boolean;
        sort_asc: boolean;
        sort_field: string;
    }>;
    connection_grid_size: z.ZodNumber;
    drawing: z.ZodObject<{
        dashed_lines_dash_length_ratio: z.ZodNumber;
        dashed_lines_gap_length_ratio: z.ZodNumber;
        default_line_thickness: z.ZodNumber;
        default_text_size: z.ZodNumber;
        field_names: z.ZodArray<z.ZodAny, "many">;
        intersheets_ref_own_page: z.ZodBoolean;
        intersheets_ref_prefix: z.ZodString;
        intersheets_ref_short: z.ZodBoolean;
        intersheets_ref_show: z.ZodBoolean;
        intersheets_ref_suffix: z.ZodString;
        junction_size_choice: z.ZodNumber;
        label_size_ratio: z.ZodNumber;
        operating_point_overlay_i_precision: z.ZodNumber;
        operating_point_overlay_i_range: z.ZodString;
        operating_point_overlay_v_precision: z.ZodNumber;
        operating_point_overlay_v_range: z.ZodString;
        overbar_offset_ratio: z.ZodNumber;
        pin_symbol_size: z.ZodNumber;
        text_offset_ratio: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        dashed_lines_dash_length_ratio: number;
        dashed_lines_gap_length_ratio: number;
        default_line_thickness: number;
        default_text_size: number;
        field_names: any[];
        intersheets_ref_own_page: boolean;
        intersheets_ref_prefix: string;
        intersheets_ref_short: boolean;
        intersheets_ref_show: boolean;
        intersheets_ref_suffix: string;
        junction_size_choice: number;
        label_size_ratio: number;
        operating_point_overlay_i_precision: number;
        operating_point_overlay_i_range: string;
        operating_point_overlay_v_precision: number;
        operating_point_overlay_v_range: string;
        overbar_offset_ratio: number;
        pin_symbol_size: number;
        text_offset_ratio: number;
    }, {
        dashed_lines_dash_length_ratio: number;
        dashed_lines_gap_length_ratio: number;
        default_line_thickness: number;
        default_text_size: number;
        field_names: any[];
        intersheets_ref_own_page: boolean;
        intersheets_ref_prefix: string;
        intersheets_ref_short: boolean;
        intersheets_ref_show: boolean;
        intersheets_ref_suffix: string;
        junction_size_choice: number;
        label_size_ratio: number;
        operating_point_overlay_i_precision: number;
        operating_point_overlay_i_range: string;
        operating_point_overlay_v_precision: number;
        operating_point_overlay_v_range: string;
        overbar_offset_ratio: number;
        pin_symbol_size: number;
        text_offset_ratio: number;
    }>;
    legacy_lib_dir: z.ZodString;
    legacy_lib_list: z.ZodArray<z.ZodAny, "many">;
    meta: z.ZodObject<{
        version: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        version: number;
    }, {
        version: number;
    }>;
    net_format_name: z.ZodString;
    page_layout_descr_file: z.ZodString;
    plot_directory: z.ZodString;
    spice_current_sheet_as_root: z.ZodBoolean;
    spice_external_command: z.ZodString;
    spice_model_current_sheet_as_root: z.ZodBoolean;
    spice_save_all_currents: z.ZodBoolean;
    spice_save_all_dissipations: z.ZodBoolean;
    spice_save_all_voltages: z.ZodBoolean;
    subpart_first_id: z.ZodNumber;
    subpart_id_separator: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    meta: {
        version: number;
    };
    page_layout_descr_file: string;
    annotate_start_num: number;
    bom_export_filename: string;
    bom_fmt_presets: any[];
    bom_fmt_settings: {
        name: string;
        field_delimiter: string;
        keep_line_breaks: boolean;
        keep_tabs: boolean;
        ref_delimiter: string;
        ref_range_delimiter: string;
        string_delimiter: string;
    };
    bom_presets: any[];
    bom_settings: {
        name: string;
        exclude_dnp: boolean;
        fields_ordered: {
            name: string;
            group_by: boolean;
            label: string;
            show: boolean;
        }[];
        filter_string: string;
        group_symbols: boolean;
        sort_asc: boolean;
        sort_field: string;
    };
    connection_grid_size: number;
    drawing: {
        dashed_lines_dash_length_ratio: number;
        dashed_lines_gap_length_ratio: number;
        default_line_thickness: number;
        default_text_size: number;
        field_names: any[];
        intersheets_ref_own_page: boolean;
        intersheets_ref_prefix: string;
        intersheets_ref_short: boolean;
        intersheets_ref_show: boolean;
        intersheets_ref_suffix: string;
        junction_size_choice: number;
        label_size_ratio: number;
        operating_point_overlay_i_precision: number;
        operating_point_overlay_i_range: string;
        operating_point_overlay_v_precision: number;
        operating_point_overlay_v_range: string;
        overbar_offset_ratio: number;
        pin_symbol_size: number;
        text_offset_ratio: number;
    };
    legacy_lib_dir: string;
    legacy_lib_list: any[];
    net_format_name: string;
    plot_directory: string;
    spice_current_sheet_as_root: boolean;
    spice_external_command: string;
    spice_model_current_sheet_as_root: boolean;
    spice_save_all_currents: boolean;
    spice_save_all_dissipations: boolean;
    spice_save_all_voltages: boolean;
    subpart_first_id: number;
    subpart_id_separator: number;
}, {
    meta: {
        version: number;
    };
    page_layout_descr_file: string;
    annotate_start_num: number;
    bom_export_filename: string;
    bom_fmt_presets: any[];
    bom_fmt_settings: {
        name: string;
        field_delimiter: string;
        keep_line_breaks: boolean;
        keep_tabs: boolean;
        ref_delimiter: string;
        ref_range_delimiter: string;
        string_delimiter: string;
    };
    bom_presets: any[];
    bom_settings: {
        name: string;
        exclude_dnp: boolean;
        fields_ordered: {
            name: string;
            group_by: boolean;
            label: string;
            show: boolean;
        }[];
        filter_string: string;
        group_symbols: boolean;
        sort_asc: boolean;
        sort_field: string;
    };
    connection_grid_size: number;
    drawing: {
        dashed_lines_dash_length_ratio: number;
        dashed_lines_gap_length_ratio: number;
        default_line_thickness: number;
        default_text_size: number;
        field_names: any[];
        intersheets_ref_own_page: boolean;
        intersheets_ref_prefix: string;
        intersheets_ref_short: boolean;
        intersheets_ref_show: boolean;
        intersheets_ref_suffix: string;
        junction_size_choice: number;
        label_size_ratio: number;
        operating_point_overlay_i_precision: number;
        operating_point_overlay_i_range: string;
        operating_point_overlay_v_precision: number;
        operating_point_overlay_v_range: string;
        overbar_offset_ratio: number;
        pin_symbol_size: number;
        text_offset_ratio: number;
    };
    legacy_lib_dir: string;
    legacy_lib_list: any[];
    net_format_name: string;
    plot_directory: string;
    spice_current_sheet_as_root: boolean;
    spice_external_command: string;
    spice_model_current_sheet_as_root: boolean;
    spice_save_all_currents: boolean;
    spice_save_all_dissipations: boolean;
    spice_save_all_voltages: boolean;
    subpart_first_id: number;
    subpart_id_separator: number;
}>;
declare const DefaultsSchema: z.ZodObject<{
    apply_defaults_to_fp_fields: z.ZodBoolean;
    apply_defaults_to_fp_shapes: z.ZodBoolean;
    apply_defaults_to_fp_text: z.ZodBoolean;
    board_outline_line_width: z.ZodNumber;
    copper_line_width: z.ZodNumber;
    copper_text_italic: z.ZodBoolean;
    copper_text_size_h: z.ZodNumber;
    copper_text_size_v: z.ZodNumber;
    copper_text_thickness: z.ZodNumber;
    copper_text_upright: z.ZodBoolean;
    courtyard_line_width: z.ZodNumber;
    dimension_precision: z.ZodNumber;
    dimension_units: z.ZodNumber;
    dimensions: z.ZodObject<{
        arrow_length: z.ZodNumber;
        extension_offset: z.ZodNumber;
        keep_text_aligned: z.ZodBoolean;
        suppress_zeroes: z.ZodBoolean;
        text_position: z.ZodNumber;
        units_format: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        arrow_length: number;
        extension_offset: number;
        keep_text_aligned: boolean;
        suppress_zeroes: boolean;
        text_position: number;
        units_format: number;
    }, {
        arrow_length: number;
        extension_offset: number;
        keep_text_aligned: boolean;
        suppress_zeroes: boolean;
        text_position: number;
        units_format: number;
    }>;
    fab_line_width: z.ZodNumber;
    fab_text_italic: z.ZodBoolean;
    fab_text_size_h: z.ZodNumber;
    fab_text_size_v: z.ZodNumber;
    fab_text_thickness: z.ZodNumber;
    fab_text_upright: z.ZodBoolean;
    other_line_width: z.ZodNumber;
    other_text_italic: z.ZodBoolean;
    other_text_size_h: z.ZodNumber;
    other_text_size_v: z.ZodNumber;
    other_text_thickness: z.ZodNumber;
    other_text_upright: z.ZodBoolean;
    pads: z.ZodObject<{
        drill: z.ZodNumber;
        height: z.ZodNumber;
        width: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        drill: number;
        height: number;
    }, {
        width: number;
        drill: number;
        height: number;
    }>;
    silk_line_width: z.ZodNumber;
    silk_text_italic: z.ZodBoolean;
    silk_text_size_h: z.ZodNumber;
    silk_text_size_v: z.ZodNumber;
    silk_text_thickness: z.ZodNumber;
    silk_text_upright: z.ZodBoolean;
    zones: z.ZodObject<{
        min_clearance: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min_clearance: number;
    }, {
        min_clearance: number;
    }>;
}, "strip", z.ZodTypeAny, {
    pads: {
        width: number;
        drill: number;
        height: number;
    };
    apply_defaults_to_fp_fields: boolean;
    apply_defaults_to_fp_shapes: boolean;
    apply_defaults_to_fp_text: boolean;
    board_outline_line_width: number;
    copper_line_width: number;
    copper_text_italic: boolean;
    copper_text_size_h: number;
    copper_text_size_v: number;
    copper_text_thickness: number;
    copper_text_upright: boolean;
    courtyard_line_width: number;
    dimension_precision: number;
    dimension_units: number;
    dimensions: {
        arrow_length: number;
        extension_offset: number;
        keep_text_aligned: boolean;
        suppress_zeroes: boolean;
        text_position: number;
        units_format: number;
    };
    fab_line_width: number;
    fab_text_italic: boolean;
    fab_text_size_h: number;
    fab_text_size_v: number;
    fab_text_thickness: number;
    fab_text_upright: boolean;
    other_line_width: number;
    other_text_italic: boolean;
    other_text_size_h: number;
    other_text_size_v: number;
    other_text_thickness: number;
    other_text_upright: boolean;
    silk_line_width: number;
    silk_text_italic: boolean;
    silk_text_size_h: number;
    silk_text_size_v: number;
    silk_text_thickness: number;
    silk_text_upright: boolean;
    zones: {
        min_clearance: number;
    };
}, {
    pads: {
        width: number;
        drill: number;
        height: number;
    };
    apply_defaults_to_fp_fields: boolean;
    apply_defaults_to_fp_shapes: boolean;
    apply_defaults_to_fp_text: boolean;
    board_outline_line_width: number;
    copper_line_width: number;
    copper_text_italic: boolean;
    copper_text_size_h: number;
    copper_text_size_v: number;
    copper_text_thickness: number;
    copper_text_upright: boolean;
    courtyard_line_width: number;
    dimension_precision: number;
    dimension_units: number;
    dimensions: {
        arrow_length: number;
        extension_offset: number;
        keep_text_aligned: boolean;
        suppress_zeroes: boolean;
        text_position: number;
        units_format: number;
    };
    fab_line_width: number;
    fab_text_italic: boolean;
    fab_text_size_h: number;
    fab_text_size_v: number;
    fab_text_thickness: number;
    fab_text_upright: boolean;
    other_line_width: number;
    other_text_italic: boolean;
    other_text_size_h: number;
    other_text_size_v: number;
    other_text_thickness: number;
    other_text_upright: boolean;
    silk_line_width: number;
    silk_text_italic: boolean;
    silk_text_size_h: number;
    silk_text_size_v: number;
    silk_text_thickness: number;
    silk_text_upright: boolean;
    zones: {
        min_clearance: number;
    };
}>;
declare const DesignSettingsSchema: z.ZodObject<{
    defaults: z.ZodObject<{
        apply_defaults_to_fp_fields: z.ZodBoolean;
        apply_defaults_to_fp_shapes: z.ZodBoolean;
        apply_defaults_to_fp_text: z.ZodBoolean;
        board_outline_line_width: z.ZodNumber;
        copper_line_width: z.ZodNumber;
        copper_text_italic: z.ZodBoolean;
        copper_text_size_h: z.ZodNumber;
        copper_text_size_v: z.ZodNumber;
        copper_text_thickness: z.ZodNumber;
        copper_text_upright: z.ZodBoolean;
        courtyard_line_width: z.ZodNumber;
        dimension_precision: z.ZodNumber;
        dimension_units: z.ZodNumber;
        dimensions: z.ZodObject<{
            arrow_length: z.ZodNumber;
            extension_offset: z.ZodNumber;
            keep_text_aligned: z.ZodBoolean;
            suppress_zeroes: z.ZodBoolean;
            text_position: z.ZodNumber;
            units_format: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            arrow_length: number;
            extension_offset: number;
            keep_text_aligned: boolean;
            suppress_zeroes: boolean;
            text_position: number;
            units_format: number;
        }, {
            arrow_length: number;
            extension_offset: number;
            keep_text_aligned: boolean;
            suppress_zeroes: boolean;
            text_position: number;
            units_format: number;
        }>;
        fab_line_width: z.ZodNumber;
        fab_text_italic: z.ZodBoolean;
        fab_text_size_h: z.ZodNumber;
        fab_text_size_v: z.ZodNumber;
        fab_text_thickness: z.ZodNumber;
        fab_text_upright: z.ZodBoolean;
        other_line_width: z.ZodNumber;
        other_text_italic: z.ZodBoolean;
        other_text_size_h: z.ZodNumber;
        other_text_size_v: z.ZodNumber;
        other_text_thickness: z.ZodNumber;
        other_text_upright: z.ZodBoolean;
        pads: z.ZodObject<{
            drill: z.ZodNumber;
            height: z.ZodNumber;
            width: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            drill: number;
            height: number;
        }, {
            width: number;
            drill: number;
            height: number;
        }>;
        silk_line_width: z.ZodNumber;
        silk_text_italic: z.ZodBoolean;
        silk_text_size_h: z.ZodNumber;
        silk_text_size_v: z.ZodNumber;
        silk_text_thickness: z.ZodNumber;
        silk_text_upright: z.ZodBoolean;
        zones: z.ZodObject<{
            min_clearance: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            min_clearance: number;
        }, {
            min_clearance: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        pads: {
            width: number;
            drill: number;
            height: number;
        };
        apply_defaults_to_fp_fields: boolean;
        apply_defaults_to_fp_shapes: boolean;
        apply_defaults_to_fp_text: boolean;
        board_outline_line_width: number;
        copper_line_width: number;
        copper_text_italic: boolean;
        copper_text_size_h: number;
        copper_text_size_v: number;
        copper_text_thickness: number;
        copper_text_upright: boolean;
        courtyard_line_width: number;
        dimension_precision: number;
        dimension_units: number;
        dimensions: {
            arrow_length: number;
            extension_offset: number;
            keep_text_aligned: boolean;
            suppress_zeroes: boolean;
            text_position: number;
            units_format: number;
        };
        fab_line_width: number;
        fab_text_italic: boolean;
        fab_text_size_h: number;
        fab_text_size_v: number;
        fab_text_thickness: number;
        fab_text_upright: boolean;
        other_line_width: number;
        other_text_italic: boolean;
        other_text_size_h: number;
        other_text_size_v: number;
        other_text_thickness: number;
        other_text_upright: boolean;
        silk_line_width: number;
        silk_text_italic: boolean;
        silk_text_size_h: number;
        silk_text_size_v: number;
        silk_text_thickness: number;
        silk_text_upright: boolean;
        zones: {
            min_clearance: number;
        };
    }, {
        pads: {
            width: number;
            drill: number;
            height: number;
        };
        apply_defaults_to_fp_fields: boolean;
        apply_defaults_to_fp_shapes: boolean;
        apply_defaults_to_fp_text: boolean;
        board_outline_line_width: number;
        copper_line_width: number;
        copper_text_italic: boolean;
        copper_text_size_h: number;
        copper_text_size_v: number;
        copper_text_thickness: number;
        copper_text_upright: boolean;
        courtyard_line_width: number;
        dimension_precision: number;
        dimension_units: number;
        dimensions: {
            arrow_length: number;
            extension_offset: number;
            keep_text_aligned: boolean;
            suppress_zeroes: boolean;
            text_position: number;
            units_format: number;
        };
        fab_line_width: number;
        fab_text_italic: boolean;
        fab_text_size_h: number;
        fab_text_size_v: number;
        fab_text_thickness: number;
        fab_text_upright: boolean;
        other_line_width: number;
        other_text_italic: boolean;
        other_text_size_h: number;
        other_text_size_v: number;
        other_text_thickness: number;
        other_text_upright: boolean;
        silk_line_width: number;
        silk_text_italic: boolean;
        silk_text_size_h: number;
        silk_text_size_v: number;
        silk_text_thickness: number;
        silk_text_upright: boolean;
        zones: {
            min_clearance: number;
        };
    }>;
    diff_pair_dimensions: z.ZodArray<z.ZodAny, "many">;
    drc_exclusions: z.ZodArray<z.ZodAny, "many">;
    meta: z.ZodObject<{
        version: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        version: number;
    }, {
        version: number;
    }>;
    rule_severities: z.ZodRecord<z.ZodString, z.ZodString>;
    rules: z.ZodObject<{
        max_error: z.ZodNumber;
        min_clearance: z.ZodNumber;
        min_connection: z.ZodNumber;
        min_copper_edge_clearance: z.ZodNumber;
        min_hole_clearance: z.ZodNumber;
        min_hole_to_hole: z.ZodNumber;
        min_microvia_diameter: z.ZodNumber;
        min_microvia_drill: z.ZodNumber;
        min_resolved_spokes: z.ZodNumber;
        min_silk_clearance: z.ZodNumber;
        min_text_height: z.ZodNumber;
        min_text_thickness: z.ZodNumber;
        min_through_hole_diameter: z.ZodNumber;
        min_track_width: z.ZodNumber;
        min_via_annular_width: z.ZodNumber;
        min_via_diameter: z.ZodNumber;
        solder_mask_to_copper_clearance: z.ZodNumber;
        use_height_for_length_calcs: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        min_clearance: number;
        max_error: number;
        min_connection: number;
        min_copper_edge_clearance: number;
        min_hole_clearance: number;
        min_hole_to_hole: number;
        min_microvia_diameter: number;
        min_microvia_drill: number;
        min_resolved_spokes: number;
        min_silk_clearance: number;
        min_text_height: number;
        min_text_thickness: number;
        min_through_hole_diameter: number;
        min_track_width: number;
        min_via_annular_width: number;
        min_via_diameter: number;
        solder_mask_to_copper_clearance: number;
        use_height_for_length_calcs: boolean;
    }, {
        min_clearance: number;
        max_error: number;
        min_connection: number;
        min_copper_edge_clearance: number;
        min_hole_clearance: number;
        min_hole_to_hole: number;
        min_microvia_diameter: number;
        min_microvia_drill: number;
        min_resolved_spokes: number;
        min_silk_clearance: number;
        min_text_height: number;
        min_text_thickness: number;
        min_through_hole_diameter: number;
        min_track_width: number;
        min_via_annular_width: number;
        min_via_diameter: number;
        solder_mask_to_copper_clearance: number;
        use_height_for_length_calcs: boolean;
    }>;
    teardrop_options: z.ZodArray<z.ZodObject<{
        td_onpadsmd: z.ZodBoolean;
        td_onroundshapesonly: z.ZodBoolean;
        td_ontrackend: z.ZodBoolean;
        td_onviapad: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        td_onpadsmd: boolean;
        td_onroundshapesonly: boolean;
        td_ontrackend: boolean;
        td_onviapad: boolean;
    }, {
        td_onpadsmd: boolean;
        td_onroundshapesonly: boolean;
        td_ontrackend: boolean;
        td_onviapad: boolean;
    }>, "many">;
    teardrop_parameters: z.ZodArray<z.ZodObject<{
        td_allow_use_two_tracks: z.ZodBoolean;
        td_curve_segcount: z.ZodNumber;
        td_height_ratio: z.ZodNumber;
        td_length_ratio: z.ZodNumber;
        td_maxheight: z.ZodNumber;
        td_maxlen: z.ZodNumber;
        td_on_pad_in_zone: z.ZodBoolean;
        td_target_name: z.ZodString;
        td_width_to_size_filter_ratio: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        td_allow_use_two_tracks: boolean;
        td_curve_segcount: number;
        td_height_ratio: number;
        td_length_ratio: number;
        td_maxheight: number;
        td_maxlen: number;
        td_on_pad_in_zone: boolean;
        td_target_name: string;
        td_width_to_size_filter_ratio: number;
    }, {
        td_allow_use_two_tracks: boolean;
        td_curve_segcount: number;
        td_height_ratio: number;
        td_length_ratio: number;
        td_maxheight: number;
        td_maxlen: number;
        td_on_pad_in_zone: boolean;
        td_target_name: string;
        td_width_to_size_filter_ratio: number;
    }>, "many">;
    track_widths: z.ZodArray<z.ZodAny, "many">;
    tuning_pattern_settings: z.ZodObject<{
        diff_pair_defaults: z.ZodObject<{
            corner_radius_percentage: z.ZodNumber;
            corner_style: z.ZodNumber;
            max_amplitude: z.ZodNumber;
            min_amplitude: z.ZodNumber;
            single_sided: z.ZodBoolean;
            spacing: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        }, {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        }>;
        diff_pair_skew_defaults: z.ZodObject<{
            corner_radius_percentage: z.ZodNumber;
            corner_style: z.ZodNumber;
            max_amplitude: z.ZodNumber;
            min_amplitude: z.ZodNumber;
            single_sided: z.ZodBoolean;
            spacing: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        }, {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        }>;
        single_track_defaults: z.ZodObject<{
            corner_radius_percentage: z.ZodNumber;
            corner_style: z.ZodNumber;
            max_amplitude: z.ZodNumber;
            min_amplitude: z.ZodNumber;
            single_sided: z.ZodBoolean;
            spacing: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        }, {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        diff_pair_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        diff_pair_skew_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        single_track_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
    }, {
        diff_pair_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        diff_pair_skew_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        single_track_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
    }>;
    via_dimensions: z.ZodArray<z.ZodAny, "many">;
    zones_allow_external_fillets: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    meta: {
        version: number;
    };
    rule_severities: Record<string, string>;
    defaults: {
        pads: {
            width: number;
            drill: number;
            height: number;
        };
        apply_defaults_to_fp_fields: boolean;
        apply_defaults_to_fp_shapes: boolean;
        apply_defaults_to_fp_text: boolean;
        board_outline_line_width: number;
        copper_line_width: number;
        copper_text_italic: boolean;
        copper_text_size_h: number;
        copper_text_size_v: number;
        copper_text_thickness: number;
        copper_text_upright: boolean;
        courtyard_line_width: number;
        dimension_precision: number;
        dimension_units: number;
        dimensions: {
            arrow_length: number;
            extension_offset: number;
            keep_text_aligned: boolean;
            suppress_zeroes: boolean;
            text_position: number;
            units_format: number;
        };
        fab_line_width: number;
        fab_text_italic: boolean;
        fab_text_size_h: number;
        fab_text_size_v: number;
        fab_text_thickness: number;
        fab_text_upright: boolean;
        other_line_width: number;
        other_text_italic: boolean;
        other_text_size_h: number;
        other_text_size_v: number;
        other_text_thickness: number;
        other_text_upright: boolean;
        silk_line_width: number;
        silk_text_italic: boolean;
        silk_text_size_h: number;
        silk_text_size_v: number;
        silk_text_thickness: number;
        silk_text_upright: boolean;
        zones: {
            min_clearance: number;
        };
    };
    diff_pair_dimensions: any[];
    drc_exclusions: any[];
    rules: {
        min_clearance: number;
        max_error: number;
        min_connection: number;
        min_copper_edge_clearance: number;
        min_hole_clearance: number;
        min_hole_to_hole: number;
        min_microvia_diameter: number;
        min_microvia_drill: number;
        min_resolved_spokes: number;
        min_silk_clearance: number;
        min_text_height: number;
        min_text_thickness: number;
        min_through_hole_diameter: number;
        min_track_width: number;
        min_via_annular_width: number;
        min_via_diameter: number;
        solder_mask_to_copper_clearance: number;
        use_height_for_length_calcs: boolean;
    };
    teardrop_options: {
        td_onpadsmd: boolean;
        td_onroundshapesonly: boolean;
        td_ontrackend: boolean;
        td_onviapad: boolean;
    }[];
    teardrop_parameters: {
        td_allow_use_two_tracks: boolean;
        td_curve_segcount: number;
        td_height_ratio: number;
        td_length_ratio: number;
        td_maxheight: number;
        td_maxlen: number;
        td_on_pad_in_zone: boolean;
        td_target_name: string;
        td_width_to_size_filter_ratio: number;
    }[];
    track_widths: any[];
    tuning_pattern_settings: {
        diff_pair_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        diff_pair_skew_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        single_track_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
    };
    via_dimensions: any[];
    zones_allow_external_fillets: boolean;
}, {
    meta: {
        version: number;
    };
    rule_severities: Record<string, string>;
    defaults: {
        pads: {
            width: number;
            drill: number;
            height: number;
        };
        apply_defaults_to_fp_fields: boolean;
        apply_defaults_to_fp_shapes: boolean;
        apply_defaults_to_fp_text: boolean;
        board_outline_line_width: number;
        copper_line_width: number;
        copper_text_italic: boolean;
        copper_text_size_h: number;
        copper_text_size_v: number;
        copper_text_thickness: number;
        copper_text_upright: boolean;
        courtyard_line_width: number;
        dimension_precision: number;
        dimension_units: number;
        dimensions: {
            arrow_length: number;
            extension_offset: number;
            keep_text_aligned: boolean;
            suppress_zeroes: boolean;
            text_position: number;
            units_format: number;
        };
        fab_line_width: number;
        fab_text_italic: boolean;
        fab_text_size_h: number;
        fab_text_size_v: number;
        fab_text_thickness: number;
        fab_text_upright: boolean;
        other_line_width: number;
        other_text_italic: boolean;
        other_text_size_h: number;
        other_text_size_v: number;
        other_text_thickness: number;
        other_text_upright: boolean;
        silk_line_width: number;
        silk_text_italic: boolean;
        silk_text_size_h: number;
        silk_text_size_v: number;
        silk_text_thickness: number;
        silk_text_upright: boolean;
        zones: {
            min_clearance: number;
        };
    };
    diff_pair_dimensions: any[];
    drc_exclusions: any[];
    rules: {
        min_clearance: number;
        max_error: number;
        min_connection: number;
        min_copper_edge_clearance: number;
        min_hole_clearance: number;
        min_hole_to_hole: number;
        min_microvia_diameter: number;
        min_microvia_drill: number;
        min_resolved_spokes: number;
        min_silk_clearance: number;
        min_text_height: number;
        min_text_thickness: number;
        min_through_hole_diameter: number;
        min_track_width: number;
        min_via_annular_width: number;
        min_via_diameter: number;
        solder_mask_to_copper_clearance: number;
        use_height_for_length_calcs: boolean;
    };
    teardrop_options: {
        td_onpadsmd: boolean;
        td_onroundshapesonly: boolean;
        td_ontrackend: boolean;
        td_onviapad: boolean;
    }[];
    teardrop_parameters: {
        td_allow_use_two_tracks: boolean;
        td_curve_segcount: number;
        td_height_ratio: number;
        td_length_ratio: number;
        td_maxheight: number;
        td_maxlen: number;
        td_on_pad_in_zone: boolean;
        td_target_name: string;
        td_width_to_size_filter_ratio: number;
    }[];
    track_widths: any[];
    tuning_pattern_settings: {
        diff_pair_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        diff_pair_skew_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
        single_track_defaults: {
            corner_radius_percentage: number;
            corner_style: number;
            max_amplitude: number;
            min_amplitude: number;
            single_sided: boolean;
            spacing: number;
        };
    };
    via_dimensions: any[];
    zones_allow_external_fillets: boolean;
}>;
declare const BoardSchema: z.ZodObject<{
    "3dviewports": z.ZodArray<z.ZodAny, "many">;
    design_settings: z.ZodObject<{
        defaults: z.ZodObject<{
            apply_defaults_to_fp_fields: z.ZodBoolean;
            apply_defaults_to_fp_shapes: z.ZodBoolean;
            apply_defaults_to_fp_text: z.ZodBoolean;
            board_outline_line_width: z.ZodNumber;
            copper_line_width: z.ZodNumber;
            copper_text_italic: z.ZodBoolean;
            copper_text_size_h: z.ZodNumber;
            copper_text_size_v: z.ZodNumber;
            copper_text_thickness: z.ZodNumber;
            copper_text_upright: z.ZodBoolean;
            courtyard_line_width: z.ZodNumber;
            dimension_precision: z.ZodNumber;
            dimension_units: z.ZodNumber;
            dimensions: z.ZodObject<{
                arrow_length: z.ZodNumber;
                extension_offset: z.ZodNumber;
                keep_text_aligned: z.ZodBoolean;
                suppress_zeroes: z.ZodBoolean;
                text_position: z.ZodNumber;
                units_format: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            }, {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            }>;
            fab_line_width: z.ZodNumber;
            fab_text_italic: z.ZodBoolean;
            fab_text_size_h: z.ZodNumber;
            fab_text_size_v: z.ZodNumber;
            fab_text_thickness: z.ZodNumber;
            fab_text_upright: z.ZodBoolean;
            other_line_width: z.ZodNumber;
            other_text_italic: z.ZodBoolean;
            other_text_size_h: z.ZodNumber;
            other_text_size_v: z.ZodNumber;
            other_text_thickness: z.ZodNumber;
            other_text_upright: z.ZodBoolean;
            pads: z.ZodObject<{
                drill: z.ZodNumber;
                height: z.ZodNumber;
                width: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                width: number;
                drill: number;
                height: number;
            }, {
                width: number;
                drill: number;
                height: number;
            }>;
            silk_line_width: z.ZodNumber;
            silk_text_italic: z.ZodBoolean;
            silk_text_size_h: z.ZodNumber;
            silk_text_size_v: z.ZodNumber;
            silk_text_thickness: z.ZodNumber;
            silk_text_upright: z.ZodBoolean;
            zones: z.ZodObject<{
                min_clearance: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                min_clearance: number;
            }, {
                min_clearance: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            pads: {
                width: number;
                drill: number;
                height: number;
            };
            apply_defaults_to_fp_fields: boolean;
            apply_defaults_to_fp_shapes: boolean;
            apply_defaults_to_fp_text: boolean;
            board_outline_line_width: number;
            copper_line_width: number;
            copper_text_italic: boolean;
            copper_text_size_h: number;
            copper_text_size_v: number;
            copper_text_thickness: number;
            copper_text_upright: boolean;
            courtyard_line_width: number;
            dimension_precision: number;
            dimension_units: number;
            dimensions: {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            };
            fab_line_width: number;
            fab_text_italic: boolean;
            fab_text_size_h: number;
            fab_text_size_v: number;
            fab_text_thickness: number;
            fab_text_upright: boolean;
            other_line_width: number;
            other_text_italic: boolean;
            other_text_size_h: number;
            other_text_size_v: number;
            other_text_thickness: number;
            other_text_upright: boolean;
            silk_line_width: number;
            silk_text_italic: boolean;
            silk_text_size_h: number;
            silk_text_size_v: number;
            silk_text_thickness: number;
            silk_text_upright: boolean;
            zones: {
                min_clearance: number;
            };
        }, {
            pads: {
                width: number;
                drill: number;
                height: number;
            };
            apply_defaults_to_fp_fields: boolean;
            apply_defaults_to_fp_shapes: boolean;
            apply_defaults_to_fp_text: boolean;
            board_outline_line_width: number;
            copper_line_width: number;
            copper_text_italic: boolean;
            copper_text_size_h: number;
            copper_text_size_v: number;
            copper_text_thickness: number;
            copper_text_upright: boolean;
            courtyard_line_width: number;
            dimension_precision: number;
            dimension_units: number;
            dimensions: {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            };
            fab_line_width: number;
            fab_text_italic: boolean;
            fab_text_size_h: number;
            fab_text_size_v: number;
            fab_text_thickness: number;
            fab_text_upright: boolean;
            other_line_width: number;
            other_text_italic: boolean;
            other_text_size_h: number;
            other_text_size_v: number;
            other_text_thickness: number;
            other_text_upright: boolean;
            silk_line_width: number;
            silk_text_italic: boolean;
            silk_text_size_h: number;
            silk_text_size_v: number;
            silk_text_thickness: number;
            silk_text_upright: boolean;
            zones: {
                min_clearance: number;
            };
        }>;
        diff_pair_dimensions: z.ZodArray<z.ZodAny, "many">;
        drc_exclusions: z.ZodArray<z.ZodAny, "many">;
        meta: z.ZodObject<{
            version: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            version: number;
        }, {
            version: number;
        }>;
        rule_severities: z.ZodRecord<z.ZodString, z.ZodString>;
        rules: z.ZodObject<{
            max_error: z.ZodNumber;
            min_clearance: z.ZodNumber;
            min_connection: z.ZodNumber;
            min_copper_edge_clearance: z.ZodNumber;
            min_hole_clearance: z.ZodNumber;
            min_hole_to_hole: z.ZodNumber;
            min_microvia_diameter: z.ZodNumber;
            min_microvia_drill: z.ZodNumber;
            min_resolved_spokes: z.ZodNumber;
            min_silk_clearance: z.ZodNumber;
            min_text_height: z.ZodNumber;
            min_text_thickness: z.ZodNumber;
            min_through_hole_diameter: z.ZodNumber;
            min_track_width: z.ZodNumber;
            min_via_annular_width: z.ZodNumber;
            min_via_diameter: z.ZodNumber;
            solder_mask_to_copper_clearance: z.ZodNumber;
            use_height_for_length_calcs: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            min_clearance: number;
            max_error: number;
            min_connection: number;
            min_copper_edge_clearance: number;
            min_hole_clearance: number;
            min_hole_to_hole: number;
            min_microvia_diameter: number;
            min_microvia_drill: number;
            min_resolved_spokes: number;
            min_silk_clearance: number;
            min_text_height: number;
            min_text_thickness: number;
            min_through_hole_diameter: number;
            min_track_width: number;
            min_via_annular_width: number;
            min_via_diameter: number;
            solder_mask_to_copper_clearance: number;
            use_height_for_length_calcs: boolean;
        }, {
            min_clearance: number;
            max_error: number;
            min_connection: number;
            min_copper_edge_clearance: number;
            min_hole_clearance: number;
            min_hole_to_hole: number;
            min_microvia_diameter: number;
            min_microvia_drill: number;
            min_resolved_spokes: number;
            min_silk_clearance: number;
            min_text_height: number;
            min_text_thickness: number;
            min_through_hole_diameter: number;
            min_track_width: number;
            min_via_annular_width: number;
            min_via_diameter: number;
            solder_mask_to_copper_clearance: number;
            use_height_for_length_calcs: boolean;
        }>;
        teardrop_options: z.ZodArray<z.ZodObject<{
            td_onpadsmd: z.ZodBoolean;
            td_onroundshapesonly: z.ZodBoolean;
            td_ontrackend: z.ZodBoolean;
            td_onviapad: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            td_onpadsmd: boolean;
            td_onroundshapesonly: boolean;
            td_ontrackend: boolean;
            td_onviapad: boolean;
        }, {
            td_onpadsmd: boolean;
            td_onroundshapesonly: boolean;
            td_ontrackend: boolean;
            td_onviapad: boolean;
        }>, "many">;
        teardrop_parameters: z.ZodArray<z.ZodObject<{
            td_allow_use_two_tracks: z.ZodBoolean;
            td_curve_segcount: z.ZodNumber;
            td_height_ratio: z.ZodNumber;
            td_length_ratio: z.ZodNumber;
            td_maxheight: z.ZodNumber;
            td_maxlen: z.ZodNumber;
            td_on_pad_in_zone: z.ZodBoolean;
            td_target_name: z.ZodString;
            td_width_to_size_filter_ratio: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            td_allow_use_two_tracks: boolean;
            td_curve_segcount: number;
            td_height_ratio: number;
            td_length_ratio: number;
            td_maxheight: number;
            td_maxlen: number;
            td_on_pad_in_zone: boolean;
            td_target_name: string;
            td_width_to_size_filter_ratio: number;
        }, {
            td_allow_use_two_tracks: boolean;
            td_curve_segcount: number;
            td_height_ratio: number;
            td_length_ratio: number;
            td_maxheight: number;
            td_maxlen: number;
            td_on_pad_in_zone: boolean;
            td_target_name: string;
            td_width_to_size_filter_ratio: number;
        }>, "many">;
        track_widths: z.ZodArray<z.ZodAny, "many">;
        tuning_pattern_settings: z.ZodObject<{
            diff_pair_defaults: z.ZodObject<{
                corner_radius_percentage: z.ZodNumber;
                corner_style: z.ZodNumber;
                max_amplitude: z.ZodNumber;
                min_amplitude: z.ZodNumber;
                single_sided: z.ZodBoolean;
                spacing: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            }, {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            }>;
            diff_pair_skew_defaults: z.ZodObject<{
                corner_radius_percentage: z.ZodNumber;
                corner_style: z.ZodNumber;
                max_amplitude: z.ZodNumber;
                min_amplitude: z.ZodNumber;
                single_sided: z.ZodBoolean;
                spacing: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            }, {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            }>;
            single_track_defaults: z.ZodObject<{
                corner_radius_percentage: z.ZodNumber;
                corner_style: z.ZodNumber;
                max_amplitude: z.ZodNumber;
                min_amplitude: z.ZodNumber;
                single_sided: z.ZodBoolean;
                spacing: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            }, {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            diff_pair_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            diff_pair_skew_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            single_track_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
        }, {
            diff_pair_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            diff_pair_skew_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            single_track_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
        }>;
        via_dimensions: z.ZodArray<z.ZodAny, "many">;
        zones_allow_external_fillets: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        meta: {
            version: number;
        };
        rule_severities: Record<string, string>;
        defaults: {
            pads: {
                width: number;
                drill: number;
                height: number;
            };
            apply_defaults_to_fp_fields: boolean;
            apply_defaults_to_fp_shapes: boolean;
            apply_defaults_to_fp_text: boolean;
            board_outline_line_width: number;
            copper_line_width: number;
            copper_text_italic: boolean;
            copper_text_size_h: number;
            copper_text_size_v: number;
            copper_text_thickness: number;
            copper_text_upright: boolean;
            courtyard_line_width: number;
            dimension_precision: number;
            dimension_units: number;
            dimensions: {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            };
            fab_line_width: number;
            fab_text_italic: boolean;
            fab_text_size_h: number;
            fab_text_size_v: number;
            fab_text_thickness: number;
            fab_text_upright: boolean;
            other_line_width: number;
            other_text_italic: boolean;
            other_text_size_h: number;
            other_text_size_v: number;
            other_text_thickness: number;
            other_text_upright: boolean;
            silk_line_width: number;
            silk_text_italic: boolean;
            silk_text_size_h: number;
            silk_text_size_v: number;
            silk_text_thickness: number;
            silk_text_upright: boolean;
            zones: {
                min_clearance: number;
            };
        };
        diff_pair_dimensions: any[];
        drc_exclusions: any[];
        rules: {
            min_clearance: number;
            max_error: number;
            min_connection: number;
            min_copper_edge_clearance: number;
            min_hole_clearance: number;
            min_hole_to_hole: number;
            min_microvia_diameter: number;
            min_microvia_drill: number;
            min_resolved_spokes: number;
            min_silk_clearance: number;
            min_text_height: number;
            min_text_thickness: number;
            min_through_hole_diameter: number;
            min_track_width: number;
            min_via_annular_width: number;
            min_via_diameter: number;
            solder_mask_to_copper_clearance: number;
            use_height_for_length_calcs: boolean;
        };
        teardrop_options: {
            td_onpadsmd: boolean;
            td_onroundshapesonly: boolean;
            td_ontrackend: boolean;
            td_onviapad: boolean;
        }[];
        teardrop_parameters: {
            td_allow_use_two_tracks: boolean;
            td_curve_segcount: number;
            td_height_ratio: number;
            td_length_ratio: number;
            td_maxheight: number;
            td_maxlen: number;
            td_on_pad_in_zone: boolean;
            td_target_name: string;
            td_width_to_size_filter_ratio: number;
        }[];
        track_widths: any[];
        tuning_pattern_settings: {
            diff_pair_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            diff_pair_skew_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            single_track_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
        };
        via_dimensions: any[];
        zones_allow_external_fillets: boolean;
    }, {
        meta: {
            version: number;
        };
        rule_severities: Record<string, string>;
        defaults: {
            pads: {
                width: number;
                drill: number;
                height: number;
            };
            apply_defaults_to_fp_fields: boolean;
            apply_defaults_to_fp_shapes: boolean;
            apply_defaults_to_fp_text: boolean;
            board_outline_line_width: number;
            copper_line_width: number;
            copper_text_italic: boolean;
            copper_text_size_h: number;
            copper_text_size_v: number;
            copper_text_thickness: number;
            copper_text_upright: boolean;
            courtyard_line_width: number;
            dimension_precision: number;
            dimension_units: number;
            dimensions: {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            };
            fab_line_width: number;
            fab_text_italic: boolean;
            fab_text_size_h: number;
            fab_text_size_v: number;
            fab_text_thickness: number;
            fab_text_upright: boolean;
            other_line_width: number;
            other_text_italic: boolean;
            other_text_size_h: number;
            other_text_size_v: number;
            other_text_thickness: number;
            other_text_upright: boolean;
            silk_line_width: number;
            silk_text_italic: boolean;
            silk_text_size_h: number;
            silk_text_size_v: number;
            silk_text_thickness: number;
            silk_text_upright: boolean;
            zones: {
                min_clearance: number;
            };
        };
        diff_pair_dimensions: any[];
        drc_exclusions: any[];
        rules: {
            min_clearance: number;
            max_error: number;
            min_connection: number;
            min_copper_edge_clearance: number;
            min_hole_clearance: number;
            min_hole_to_hole: number;
            min_microvia_diameter: number;
            min_microvia_drill: number;
            min_resolved_spokes: number;
            min_silk_clearance: number;
            min_text_height: number;
            min_text_thickness: number;
            min_through_hole_diameter: number;
            min_track_width: number;
            min_via_annular_width: number;
            min_via_diameter: number;
            solder_mask_to_copper_clearance: number;
            use_height_for_length_calcs: boolean;
        };
        teardrop_options: {
            td_onpadsmd: boolean;
            td_onroundshapesonly: boolean;
            td_ontrackend: boolean;
            td_onviapad: boolean;
        }[];
        teardrop_parameters: {
            td_allow_use_two_tracks: boolean;
            td_curve_segcount: number;
            td_height_ratio: number;
            td_length_ratio: number;
            td_maxheight: number;
            td_maxlen: number;
            td_on_pad_in_zone: boolean;
            td_target_name: string;
            td_width_to_size_filter_ratio: number;
        }[];
        track_widths: any[];
        tuning_pattern_settings: {
            diff_pair_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            diff_pair_skew_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            single_track_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
        };
        via_dimensions: any[];
        zones_allow_external_fillets: boolean;
    }>;
    ipc2581: z.ZodObject<{
        dist: z.ZodString;
        distpn: z.ZodString;
        internal_id: z.ZodString;
        mfg: z.ZodString;
        mpn: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        dist: string;
        distpn: string;
        internal_id: string;
        mfg: string;
        mpn: string;
    }, {
        dist: string;
        distpn: string;
        internal_id: string;
        mfg: string;
        mpn: string;
    }>;
    layer_presets: z.ZodArray<z.ZodAny, "many">;
    viewports: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    "3dviewports": any[];
    design_settings: {
        meta: {
            version: number;
        };
        rule_severities: Record<string, string>;
        defaults: {
            pads: {
                width: number;
                drill: number;
                height: number;
            };
            apply_defaults_to_fp_fields: boolean;
            apply_defaults_to_fp_shapes: boolean;
            apply_defaults_to_fp_text: boolean;
            board_outline_line_width: number;
            copper_line_width: number;
            copper_text_italic: boolean;
            copper_text_size_h: number;
            copper_text_size_v: number;
            copper_text_thickness: number;
            copper_text_upright: boolean;
            courtyard_line_width: number;
            dimension_precision: number;
            dimension_units: number;
            dimensions: {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            };
            fab_line_width: number;
            fab_text_italic: boolean;
            fab_text_size_h: number;
            fab_text_size_v: number;
            fab_text_thickness: number;
            fab_text_upright: boolean;
            other_line_width: number;
            other_text_italic: boolean;
            other_text_size_h: number;
            other_text_size_v: number;
            other_text_thickness: number;
            other_text_upright: boolean;
            silk_line_width: number;
            silk_text_italic: boolean;
            silk_text_size_h: number;
            silk_text_size_v: number;
            silk_text_thickness: number;
            silk_text_upright: boolean;
            zones: {
                min_clearance: number;
            };
        };
        diff_pair_dimensions: any[];
        drc_exclusions: any[];
        rules: {
            min_clearance: number;
            max_error: number;
            min_connection: number;
            min_copper_edge_clearance: number;
            min_hole_clearance: number;
            min_hole_to_hole: number;
            min_microvia_diameter: number;
            min_microvia_drill: number;
            min_resolved_spokes: number;
            min_silk_clearance: number;
            min_text_height: number;
            min_text_thickness: number;
            min_through_hole_diameter: number;
            min_track_width: number;
            min_via_annular_width: number;
            min_via_diameter: number;
            solder_mask_to_copper_clearance: number;
            use_height_for_length_calcs: boolean;
        };
        teardrop_options: {
            td_onpadsmd: boolean;
            td_onroundshapesonly: boolean;
            td_ontrackend: boolean;
            td_onviapad: boolean;
        }[];
        teardrop_parameters: {
            td_allow_use_two_tracks: boolean;
            td_curve_segcount: number;
            td_height_ratio: number;
            td_length_ratio: number;
            td_maxheight: number;
            td_maxlen: number;
            td_on_pad_in_zone: boolean;
            td_target_name: string;
            td_width_to_size_filter_ratio: number;
        }[];
        track_widths: any[];
        tuning_pattern_settings: {
            diff_pair_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            diff_pair_skew_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            single_track_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
        };
        via_dimensions: any[];
        zones_allow_external_fillets: boolean;
    };
    ipc2581: {
        dist: string;
        distpn: string;
        internal_id: string;
        mfg: string;
        mpn: string;
    };
    layer_presets: any[];
    viewports: any[];
}, {
    "3dviewports": any[];
    design_settings: {
        meta: {
            version: number;
        };
        rule_severities: Record<string, string>;
        defaults: {
            pads: {
                width: number;
                drill: number;
                height: number;
            };
            apply_defaults_to_fp_fields: boolean;
            apply_defaults_to_fp_shapes: boolean;
            apply_defaults_to_fp_text: boolean;
            board_outline_line_width: number;
            copper_line_width: number;
            copper_text_italic: boolean;
            copper_text_size_h: number;
            copper_text_size_v: number;
            copper_text_thickness: number;
            copper_text_upright: boolean;
            courtyard_line_width: number;
            dimension_precision: number;
            dimension_units: number;
            dimensions: {
                arrow_length: number;
                extension_offset: number;
                keep_text_aligned: boolean;
                suppress_zeroes: boolean;
                text_position: number;
                units_format: number;
            };
            fab_line_width: number;
            fab_text_italic: boolean;
            fab_text_size_h: number;
            fab_text_size_v: number;
            fab_text_thickness: number;
            fab_text_upright: boolean;
            other_line_width: number;
            other_text_italic: boolean;
            other_text_size_h: number;
            other_text_size_v: number;
            other_text_thickness: number;
            other_text_upright: boolean;
            silk_line_width: number;
            silk_text_italic: boolean;
            silk_text_size_h: number;
            silk_text_size_v: number;
            silk_text_thickness: number;
            silk_text_upright: boolean;
            zones: {
                min_clearance: number;
            };
        };
        diff_pair_dimensions: any[];
        drc_exclusions: any[];
        rules: {
            min_clearance: number;
            max_error: number;
            min_connection: number;
            min_copper_edge_clearance: number;
            min_hole_clearance: number;
            min_hole_to_hole: number;
            min_microvia_diameter: number;
            min_microvia_drill: number;
            min_resolved_spokes: number;
            min_silk_clearance: number;
            min_text_height: number;
            min_text_thickness: number;
            min_through_hole_diameter: number;
            min_track_width: number;
            min_via_annular_width: number;
            min_via_diameter: number;
            solder_mask_to_copper_clearance: number;
            use_height_for_length_calcs: boolean;
        };
        teardrop_options: {
            td_onpadsmd: boolean;
            td_onroundshapesonly: boolean;
            td_ontrackend: boolean;
            td_onviapad: boolean;
        }[];
        teardrop_parameters: {
            td_allow_use_two_tracks: boolean;
            td_curve_segcount: number;
            td_height_ratio: number;
            td_length_ratio: number;
            td_maxheight: number;
            td_maxlen: number;
            td_on_pad_in_zone: boolean;
            td_target_name: string;
            td_width_to_size_filter_ratio: number;
        }[];
        track_widths: any[];
        tuning_pattern_settings: {
            diff_pair_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            diff_pair_skew_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
            single_track_defaults: {
                corner_radius_percentage: number;
                corner_style: number;
                max_amplitude: number;
                min_amplitude: number;
                single_sided: boolean;
                spacing: number;
            };
        };
        via_dimensions: any[];
        zones_allow_external_fillets: boolean;
    };
    ipc2581: {
        dist: string;
        distpn: string;
        internal_id: string;
        mfg: string;
        mpn: string;
    };
    layer_presets: any[];
    viewports: any[];
}>;
declare const KicadProjectSchema: z.ZodObject<{
    board: z.ZodObject<{
        "3dviewports": z.ZodArray<z.ZodAny, "many">;
        design_settings: z.ZodObject<{
            defaults: z.ZodObject<{
                apply_defaults_to_fp_fields: z.ZodBoolean;
                apply_defaults_to_fp_shapes: z.ZodBoolean;
                apply_defaults_to_fp_text: z.ZodBoolean;
                board_outline_line_width: z.ZodNumber;
                copper_line_width: z.ZodNumber;
                copper_text_italic: z.ZodBoolean;
                copper_text_size_h: z.ZodNumber;
                copper_text_size_v: z.ZodNumber;
                copper_text_thickness: z.ZodNumber;
                copper_text_upright: z.ZodBoolean;
                courtyard_line_width: z.ZodNumber;
                dimension_precision: z.ZodNumber;
                dimension_units: z.ZodNumber;
                dimensions: z.ZodObject<{
                    arrow_length: z.ZodNumber;
                    extension_offset: z.ZodNumber;
                    keep_text_aligned: z.ZodBoolean;
                    suppress_zeroes: z.ZodBoolean;
                    text_position: z.ZodNumber;
                    units_format: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                }, {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                }>;
                fab_line_width: z.ZodNumber;
                fab_text_italic: z.ZodBoolean;
                fab_text_size_h: z.ZodNumber;
                fab_text_size_v: z.ZodNumber;
                fab_text_thickness: z.ZodNumber;
                fab_text_upright: z.ZodBoolean;
                other_line_width: z.ZodNumber;
                other_text_italic: z.ZodBoolean;
                other_text_size_h: z.ZodNumber;
                other_text_size_v: z.ZodNumber;
                other_text_thickness: z.ZodNumber;
                other_text_upright: z.ZodBoolean;
                pads: z.ZodObject<{
                    drill: z.ZodNumber;
                    height: z.ZodNumber;
                    width: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    width: number;
                    drill: number;
                    height: number;
                }, {
                    width: number;
                    drill: number;
                    height: number;
                }>;
                silk_line_width: z.ZodNumber;
                silk_text_italic: z.ZodBoolean;
                silk_text_size_h: z.ZodNumber;
                silk_text_size_v: z.ZodNumber;
                silk_text_thickness: z.ZodNumber;
                silk_text_upright: z.ZodBoolean;
                zones: z.ZodObject<{
                    min_clearance: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    min_clearance: number;
                }, {
                    min_clearance: number;
                }>;
            }, "strip", z.ZodTypeAny, {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            }, {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            }>;
            diff_pair_dimensions: z.ZodArray<z.ZodAny, "many">;
            drc_exclusions: z.ZodArray<z.ZodAny, "many">;
            meta: z.ZodObject<{
                version: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                version: number;
            }, {
                version: number;
            }>;
            rule_severities: z.ZodRecord<z.ZodString, z.ZodString>;
            rules: z.ZodObject<{
                max_error: z.ZodNumber;
                min_clearance: z.ZodNumber;
                min_connection: z.ZodNumber;
                min_copper_edge_clearance: z.ZodNumber;
                min_hole_clearance: z.ZodNumber;
                min_hole_to_hole: z.ZodNumber;
                min_microvia_diameter: z.ZodNumber;
                min_microvia_drill: z.ZodNumber;
                min_resolved_spokes: z.ZodNumber;
                min_silk_clearance: z.ZodNumber;
                min_text_height: z.ZodNumber;
                min_text_thickness: z.ZodNumber;
                min_through_hole_diameter: z.ZodNumber;
                min_track_width: z.ZodNumber;
                min_via_annular_width: z.ZodNumber;
                min_via_diameter: z.ZodNumber;
                solder_mask_to_copper_clearance: z.ZodNumber;
                use_height_for_length_calcs: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            }, {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            }>;
            teardrop_options: z.ZodArray<z.ZodObject<{
                td_onpadsmd: z.ZodBoolean;
                td_onroundshapesonly: z.ZodBoolean;
                td_ontrackend: z.ZodBoolean;
                td_onviapad: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }, {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }>, "many">;
            teardrop_parameters: z.ZodArray<z.ZodObject<{
                td_allow_use_two_tracks: z.ZodBoolean;
                td_curve_segcount: z.ZodNumber;
                td_height_ratio: z.ZodNumber;
                td_length_ratio: z.ZodNumber;
                td_maxheight: z.ZodNumber;
                td_maxlen: z.ZodNumber;
                td_on_pad_in_zone: z.ZodBoolean;
                td_target_name: z.ZodString;
                td_width_to_size_filter_ratio: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }, {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }>, "many">;
            track_widths: z.ZodArray<z.ZodAny, "many">;
            tuning_pattern_settings: z.ZodObject<{
                diff_pair_defaults: z.ZodObject<{
                    corner_radius_percentage: z.ZodNumber;
                    corner_style: z.ZodNumber;
                    max_amplitude: z.ZodNumber;
                    min_amplitude: z.ZodNumber;
                    single_sided: z.ZodBoolean;
                    spacing: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                }, {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                }>;
                diff_pair_skew_defaults: z.ZodObject<{
                    corner_radius_percentage: z.ZodNumber;
                    corner_style: z.ZodNumber;
                    max_amplitude: z.ZodNumber;
                    min_amplitude: z.ZodNumber;
                    single_sided: z.ZodBoolean;
                    spacing: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                }, {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                }>;
                single_track_defaults: z.ZodObject<{
                    corner_radius_percentage: z.ZodNumber;
                    corner_style: z.ZodNumber;
                    max_amplitude: z.ZodNumber;
                    min_amplitude: z.ZodNumber;
                    single_sided: z.ZodBoolean;
                    spacing: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                }, {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                }>;
            }, "strip", z.ZodTypeAny, {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            }, {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            }>;
            via_dimensions: z.ZodArray<z.ZodAny, "many">;
            zones_allow_external_fillets: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            meta: {
                version: number;
            };
            rule_severities: Record<string, string>;
            defaults: {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            };
            diff_pair_dimensions: any[];
            drc_exclusions: any[];
            rules: {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            };
            teardrop_options: {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }[];
            teardrop_parameters: {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }[];
            track_widths: any[];
            tuning_pattern_settings: {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            };
            via_dimensions: any[];
            zones_allow_external_fillets: boolean;
        }, {
            meta: {
                version: number;
            };
            rule_severities: Record<string, string>;
            defaults: {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            };
            diff_pair_dimensions: any[];
            drc_exclusions: any[];
            rules: {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            };
            teardrop_options: {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }[];
            teardrop_parameters: {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }[];
            track_widths: any[];
            tuning_pattern_settings: {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            };
            via_dimensions: any[];
            zones_allow_external_fillets: boolean;
        }>;
        ipc2581: z.ZodObject<{
            dist: z.ZodString;
            distpn: z.ZodString;
            internal_id: z.ZodString;
            mfg: z.ZodString;
            mpn: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            dist: string;
            distpn: string;
            internal_id: string;
            mfg: string;
            mpn: string;
        }, {
            dist: string;
            distpn: string;
            internal_id: string;
            mfg: string;
            mpn: string;
        }>;
        layer_presets: z.ZodArray<z.ZodAny, "many">;
        viewports: z.ZodArray<z.ZodAny, "many">;
    }, "strip", z.ZodTypeAny, {
        "3dviewports": any[];
        design_settings: {
            meta: {
                version: number;
            };
            rule_severities: Record<string, string>;
            defaults: {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            };
            diff_pair_dimensions: any[];
            drc_exclusions: any[];
            rules: {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            };
            teardrop_options: {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }[];
            teardrop_parameters: {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }[];
            track_widths: any[];
            tuning_pattern_settings: {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            };
            via_dimensions: any[];
            zones_allow_external_fillets: boolean;
        };
        ipc2581: {
            dist: string;
            distpn: string;
            internal_id: string;
            mfg: string;
            mpn: string;
        };
        layer_presets: any[];
        viewports: any[];
    }, {
        "3dviewports": any[];
        design_settings: {
            meta: {
                version: number;
            };
            rule_severities: Record<string, string>;
            defaults: {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            };
            diff_pair_dimensions: any[];
            drc_exclusions: any[];
            rules: {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            };
            teardrop_options: {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }[];
            teardrop_parameters: {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }[];
            track_widths: any[];
            tuning_pattern_settings: {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            };
            via_dimensions: any[];
            zones_allow_external_fillets: boolean;
        };
        ipc2581: {
            dist: string;
            distpn: string;
            internal_id: string;
            mfg: string;
            mpn: string;
        };
        layer_presets: any[];
        viewports: any[];
    }>;
    boards: z.ZodArray<z.ZodAny, "many">;
    cvpcb: z.ZodObject<{
        equivalence_files: z.ZodArray<z.ZodAny, "many">;
    }, "strip", z.ZodTypeAny, {
        equivalence_files: any[];
    }, {
        equivalence_files: any[];
    }>;
    erc: z.ZodObject<{
        erc_exclusions: z.ZodArray<z.ZodAny, "many">;
        meta: z.ZodObject<{
            version: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            version: number;
        }, {
            version: number;
        }>;
        pin_map: z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
        rule_severities: z.ZodRecord<z.ZodString, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        erc_exclusions: any[];
        meta: {
            version: number;
        };
        pin_map: number[][];
        rule_severities: Record<string, string>;
    }, {
        erc_exclusions: any[];
        meta: {
            version: number;
        };
        pin_map: number[][];
        rule_severities: Record<string, string>;
    }>;
    libraries: z.ZodObject<{
        pinned_footprint_libs: z.ZodArray<z.ZodAny, "many">;
        pinned_symbol_libs: z.ZodArray<z.ZodAny, "many">;
    }, "strip", z.ZodTypeAny, {
        pinned_footprint_libs: any[];
        pinned_symbol_libs: any[];
    }, {
        pinned_footprint_libs: any[];
        pinned_symbol_libs: any[];
    }>;
    meta: z.ZodObject<{
        filename: z.ZodString;
        version: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        version: number;
        filename: string;
    }, {
        version: number;
        filename: string;
    }>;
    net_settings: z.ZodObject<{
        classes: z.ZodArray<z.ZodObject<{
            bus_width: z.ZodNumber;
            clearance: z.ZodNumber;
            diff_pair_gap: z.ZodNumber;
            diff_pair_via_gap: z.ZodNumber;
            diff_pair_width: z.ZodNumber;
            line_style: z.ZodNumber;
            microvia_diameter: z.ZodNumber;
            microvia_drill: z.ZodNumber;
            name: z.ZodString;
            pcb_color: z.ZodString;
            schematic_color: z.ZodString;
            track_width: z.ZodNumber;
            via_diameter: z.ZodNumber;
            via_drill: z.ZodNumber;
            wire_width: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            clearance: number;
            track_width: number;
            bus_width: number;
            diff_pair_gap: number;
            diff_pair_via_gap: number;
            diff_pair_width: number;
            line_style: number;
            microvia_diameter: number;
            microvia_drill: number;
            pcb_color: string;
            schematic_color: string;
            via_diameter: number;
            via_drill: number;
            wire_width: number;
        }, {
            name: string;
            clearance: number;
            track_width: number;
            bus_width: number;
            diff_pair_gap: number;
            diff_pair_via_gap: number;
            diff_pair_width: number;
            line_style: number;
            microvia_diameter: number;
            microvia_drill: number;
            pcb_color: string;
            schematic_color: string;
            via_diameter: number;
            via_drill: number;
            wire_width: number;
        }>, "many">;
        meta: z.ZodObject<{
            version: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            version: number;
        }, {
            version: number;
        }>;
        net_colors: z.ZodAny;
        netclass_assignments: z.ZodAny;
        netclass_patterns: z.ZodArray<z.ZodAny, "many">;
    }, "strip", z.ZodTypeAny, {
        meta: {
            version: number;
        };
        classes: {
            name: string;
            clearance: number;
            track_width: number;
            bus_width: number;
            diff_pair_gap: number;
            diff_pair_via_gap: number;
            diff_pair_width: number;
            line_style: number;
            microvia_diameter: number;
            microvia_drill: number;
            pcb_color: string;
            schematic_color: string;
            via_diameter: number;
            via_drill: number;
            wire_width: number;
        }[];
        netclass_patterns: any[];
        net_colors?: any;
        netclass_assignments?: any;
    }, {
        meta: {
            version: number;
        };
        classes: {
            name: string;
            clearance: number;
            track_width: number;
            bus_width: number;
            diff_pair_gap: number;
            diff_pair_via_gap: number;
            diff_pair_width: number;
            line_style: number;
            microvia_diameter: number;
            microvia_drill: number;
            pcb_color: string;
            schematic_color: string;
            via_diameter: number;
            via_drill: number;
            wire_width: number;
        }[];
        netclass_patterns: any[];
        net_colors?: any;
        netclass_assignments?: any;
    }>;
    pcbnew: z.ZodObject<{
        last_paths: z.ZodObject<{
            gencad: z.ZodString;
            idf: z.ZodString;
            netlist: z.ZodString;
            plot: z.ZodString;
            pos_files: z.ZodString;
            specctra_dsn: z.ZodString;
            step: z.ZodString;
            svg: z.ZodString;
            vrml: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            gencad: string;
            idf: string;
            netlist: string;
            plot: string;
            pos_files: string;
            specctra_dsn: string;
            step: string;
            svg: string;
            vrml: string;
        }, {
            gencad: string;
            idf: string;
            netlist: string;
            plot: string;
            pos_files: string;
            specctra_dsn: string;
            step: string;
            svg: string;
            vrml: string;
        }>;
        page_layout_descr_file: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        last_paths: {
            gencad: string;
            idf: string;
            netlist: string;
            plot: string;
            pos_files: string;
            specctra_dsn: string;
            step: string;
            svg: string;
            vrml: string;
        };
        page_layout_descr_file: string;
    }, {
        last_paths: {
            gencad: string;
            idf: string;
            netlist: string;
            plot: string;
            pos_files: string;
            specctra_dsn: string;
            step: string;
            svg: string;
            vrml: string;
        };
        page_layout_descr_file: string;
    }>;
    schematic: z.ZodObject<{
        annotate_start_num: z.ZodNumber;
        bom_export_filename: z.ZodString;
        bom_fmt_presets: z.ZodArray<z.ZodAny, "many">;
        bom_fmt_settings: z.ZodObject<{
            field_delimiter: z.ZodString;
            keep_line_breaks: z.ZodBoolean;
            keep_tabs: z.ZodBoolean;
            name: z.ZodString;
            ref_delimiter: z.ZodString;
            ref_range_delimiter: z.ZodString;
            string_delimiter: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            field_delimiter: string;
            keep_line_breaks: boolean;
            keep_tabs: boolean;
            ref_delimiter: string;
            ref_range_delimiter: string;
            string_delimiter: string;
        }, {
            name: string;
            field_delimiter: string;
            keep_line_breaks: boolean;
            keep_tabs: boolean;
            ref_delimiter: string;
            ref_range_delimiter: string;
            string_delimiter: string;
        }>;
        bom_presets: z.ZodArray<z.ZodAny, "many">;
        bom_settings: z.ZodObject<{
            exclude_dnp: z.ZodBoolean;
            fields_ordered: z.ZodArray<z.ZodObject<{
                group_by: z.ZodBoolean;
                label: z.ZodString;
                name: z.ZodString;
                show: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }, {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }>, "many">;
            filter_string: z.ZodString;
            group_symbols: z.ZodBoolean;
            name: z.ZodString;
            sort_asc: z.ZodBoolean;
            sort_field: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            exclude_dnp: boolean;
            fields_ordered: {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }[];
            filter_string: string;
            group_symbols: boolean;
            sort_asc: boolean;
            sort_field: string;
        }, {
            name: string;
            exclude_dnp: boolean;
            fields_ordered: {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }[];
            filter_string: string;
            group_symbols: boolean;
            sort_asc: boolean;
            sort_field: string;
        }>;
        connection_grid_size: z.ZodNumber;
        drawing: z.ZodObject<{
            dashed_lines_dash_length_ratio: z.ZodNumber;
            dashed_lines_gap_length_ratio: z.ZodNumber;
            default_line_thickness: z.ZodNumber;
            default_text_size: z.ZodNumber;
            field_names: z.ZodArray<z.ZodAny, "many">;
            intersheets_ref_own_page: z.ZodBoolean;
            intersheets_ref_prefix: z.ZodString;
            intersheets_ref_short: z.ZodBoolean;
            intersheets_ref_show: z.ZodBoolean;
            intersheets_ref_suffix: z.ZodString;
            junction_size_choice: z.ZodNumber;
            label_size_ratio: z.ZodNumber;
            operating_point_overlay_i_precision: z.ZodNumber;
            operating_point_overlay_i_range: z.ZodString;
            operating_point_overlay_v_precision: z.ZodNumber;
            operating_point_overlay_v_range: z.ZodString;
            overbar_offset_ratio: z.ZodNumber;
            pin_symbol_size: z.ZodNumber;
            text_offset_ratio: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            dashed_lines_dash_length_ratio: number;
            dashed_lines_gap_length_ratio: number;
            default_line_thickness: number;
            default_text_size: number;
            field_names: any[];
            intersheets_ref_own_page: boolean;
            intersheets_ref_prefix: string;
            intersheets_ref_short: boolean;
            intersheets_ref_show: boolean;
            intersheets_ref_suffix: string;
            junction_size_choice: number;
            label_size_ratio: number;
            operating_point_overlay_i_precision: number;
            operating_point_overlay_i_range: string;
            operating_point_overlay_v_precision: number;
            operating_point_overlay_v_range: string;
            overbar_offset_ratio: number;
            pin_symbol_size: number;
            text_offset_ratio: number;
        }, {
            dashed_lines_dash_length_ratio: number;
            dashed_lines_gap_length_ratio: number;
            default_line_thickness: number;
            default_text_size: number;
            field_names: any[];
            intersheets_ref_own_page: boolean;
            intersheets_ref_prefix: string;
            intersheets_ref_short: boolean;
            intersheets_ref_show: boolean;
            intersheets_ref_suffix: string;
            junction_size_choice: number;
            label_size_ratio: number;
            operating_point_overlay_i_precision: number;
            operating_point_overlay_i_range: string;
            operating_point_overlay_v_precision: number;
            operating_point_overlay_v_range: string;
            overbar_offset_ratio: number;
            pin_symbol_size: number;
            text_offset_ratio: number;
        }>;
        legacy_lib_dir: z.ZodString;
        legacy_lib_list: z.ZodArray<z.ZodAny, "many">;
        meta: z.ZodObject<{
            version: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            version: number;
        }, {
            version: number;
        }>;
        net_format_name: z.ZodString;
        page_layout_descr_file: z.ZodString;
        plot_directory: z.ZodString;
        spice_current_sheet_as_root: z.ZodBoolean;
        spice_external_command: z.ZodString;
        spice_model_current_sheet_as_root: z.ZodBoolean;
        spice_save_all_currents: z.ZodBoolean;
        spice_save_all_dissipations: z.ZodBoolean;
        spice_save_all_voltages: z.ZodBoolean;
        subpart_first_id: z.ZodNumber;
        subpart_id_separator: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        meta: {
            version: number;
        };
        page_layout_descr_file: string;
        annotate_start_num: number;
        bom_export_filename: string;
        bom_fmt_presets: any[];
        bom_fmt_settings: {
            name: string;
            field_delimiter: string;
            keep_line_breaks: boolean;
            keep_tabs: boolean;
            ref_delimiter: string;
            ref_range_delimiter: string;
            string_delimiter: string;
        };
        bom_presets: any[];
        bom_settings: {
            name: string;
            exclude_dnp: boolean;
            fields_ordered: {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }[];
            filter_string: string;
            group_symbols: boolean;
            sort_asc: boolean;
            sort_field: string;
        };
        connection_grid_size: number;
        drawing: {
            dashed_lines_dash_length_ratio: number;
            dashed_lines_gap_length_ratio: number;
            default_line_thickness: number;
            default_text_size: number;
            field_names: any[];
            intersheets_ref_own_page: boolean;
            intersheets_ref_prefix: string;
            intersheets_ref_short: boolean;
            intersheets_ref_show: boolean;
            intersheets_ref_suffix: string;
            junction_size_choice: number;
            label_size_ratio: number;
            operating_point_overlay_i_precision: number;
            operating_point_overlay_i_range: string;
            operating_point_overlay_v_precision: number;
            operating_point_overlay_v_range: string;
            overbar_offset_ratio: number;
            pin_symbol_size: number;
            text_offset_ratio: number;
        };
        legacy_lib_dir: string;
        legacy_lib_list: any[];
        net_format_name: string;
        plot_directory: string;
        spice_current_sheet_as_root: boolean;
        spice_external_command: string;
        spice_model_current_sheet_as_root: boolean;
        spice_save_all_currents: boolean;
        spice_save_all_dissipations: boolean;
        spice_save_all_voltages: boolean;
        subpart_first_id: number;
        subpart_id_separator: number;
    }, {
        meta: {
            version: number;
        };
        page_layout_descr_file: string;
        annotate_start_num: number;
        bom_export_filename: string;
        bom_fmt_presets: any[];
        bom_fmt_settings: {
            name: string;
            field_delimiter: string;
            keep_line_breaks: boolean;
            keep_tabs: boolean;
            ref_delimiter: string;
            ref_range_delimiter: string;
            string_delimiter: string;
        };
        bom_presets: any[];
        bom_settings: {
            name: string;
            exclude_dnp: boolean;
            fields_ordered: {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }[];
            filter_string: string;
            group_symbols: boolean;
            sort_asc: boolean;
            sort_field: string;
        };
        connection_grid_size: number;
        drawing: {
            dashed_lines_dash_length_ratio: number;
            dashed_lines_gap_length_ratio: number;
            default_line_thickness: number;
            default_text_size: number;
            field_names: any[];
            intersheets_ref_own_page: boolean;
            intersheets_ref_prefix: string;
            intersheets_ref_short: boolean;
            intersheets_ref_show: boolean;
            intersheets_ref_suffix: string;
            junction_size_choice: number;
            label_size_ratio: number;
            operating_point_overlay_i_precision: number;
            operating_point_overlay_i_range: string;
            operating_point_overlay_v_precision: number;
            operating_point_overlay_v_range: string;
            overbar_offset_ratio: number;
            pin_symbol_size: number;
            text_offset_ratio: number;
        };
        legacy_lib_dir: string;
        legacy_lib_list: any[];
        net_format_name: string;
        plot_directory: string;
        spice_current_sheet_as_root: boolean;
        spice_external_command: string;
        spice_model_current_sheet_as_root: boolean;
        spice_save_all_currents: boolean;
        spice_save_all_dissipations: boolean;
        spice_save_all_voltages: boolean;
        subpart_first_id: number;
        subpart_id_separator: number;
    }>;
    sheets: z.ZodArray<z.ZodTuple<[z.ZodString, z.ZodString], null>, "many">;
    text_variables: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    meta: {
        version: number;
        filename: string;
    };
    board: {
        "3dviewports": any[];
        design_settings: {
            meta: {
                version: number;
            };
            rule_severities: Record<string, string>;
            defaults: {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            };
            diff_pair_dimensions: any[];
            drc_exclusions: any[];
            rules: {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            };
            teardrop_options: {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }[];
            teardrop_parameters: {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }[];
            track_widths: any[];
            tuning_pattern_settings: {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            };
            via_dimensions: any[];
            zones_allow_external_fillets: boolean;
        };
        ipc2581: {
            dist: string;
            distpn: string;
            internal_id: string;
            mfg: string;
            mpn: string;
        };
        layer_presets: any[];
        viewports: any[];
    };
    boards: any[];
    cvpcb: {
        equivalence_files: any[];
    };
    erc: {
        erc_exclusions: any[];
        meta: {
            version: number;
        };
        pin_map: number[][];
        rule_severities: Record<string, string>;
    };
    libraries: {
        pinned_footprint_libs: any[];
        pinned_symbol_libs: any[];
    };
    net_settings: {
        meta: {
            version: number;
        };
        classes: {
            name: string;
            clearance: number;
            track_width: number;
            bus_width: number;
            diff_pair_gap: number;
            diff_pair_via_gap: number;
            diff_pair_width: number;
            line_style: number;
            microvia_diameter: number;
            microvia_drill: number;
            pcb_color: string;
            schematic_color: string;
            via_diameter: number;
            via_drill: number;
            wire_width: number;
        }[];
        netclass_patterns: any[];
        net_colors?: any;
        netclass_assignments?: any;
    };
    pcbnew: {
        last_paths: {
            gencad: string;
            idf: string;
            netlist: string;
            plot: string;
            pos_files: string;
            specctra_dsn: string;
            step: string;
            svg: string;
            vrml: string;
        };
        page_layout_descr_file: string;
    };
    schematic: {
        meta: {
            version: number;
        };
        page_layout_descr_file: string;
        annotate_start_num: number;
        bom_export_filename: string;
        bom_fmt_presets: any[];
        bom_fmt_settings: {
            name: string;
            field_delimiter: string;
            keep_line_breaks: boolean;
            keep_tabs: boolean;
            ref_delimiter: string;
            ref_range_delimiter: string;
            string_delimiter: string;
        };
        bom_presets: any[];
        bom_settings: {
            name: string;
            exclude_dnp: boolean;
            fields_ordered: {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }[];
            filter_string: string;
            group_symbols: boolean;
            sort_asc: boolean;
            sort_field: string;
        };
        connection_grid_size: number;
        drawing: {
            dashed_lines_dash_length_ratio: number;
            dashed_lines_gap_length_ratio: number;
            default_line_thickness: number;
            default_text_size: number;
            field_names: any[];
            intersheets_ref_own_page: boolean;
            intersheets_ref_prefix: string;
            intersheets_ref_short: boolean;
            intersheets_ref_show: boolean;
            intersheets_ref_suffix: string;
            junction_size_choice: number;
            label_size_ratio: number;
            operating_point_overlay_i_precision: number;
            operating_point_overlay_i_range: string;
            operating_point_overlay_v_precision: number;
            operating_point_overlay_v_range: string;
            overbar_offset_ratio: number;
            pin_symbol_size: number;
            text_offset_ratio: number;
        };
        legacy_lib_dir: string;
        legacy_lib_list: any[];
        net_format_name: string;
        plot_directory: string;
        spice_current_sheet_as_root: boolean;
        spice_external_command: string;
        spice_model_current_sheet_as_root: boolean;
        spice_save_all_currents: boolean;
        spice_save_all_dissipations: boolean;
        spice_save_all_voltages: boolean;
        subpart_first_id: number;
        subpart_id_separator: number;
    };
    sheets: [string, string][];
    text_variables?: any;
}, {
    meta: {
        version: number;
        filename: string;
    };
    board: {
        "3dviewports": any[];
        design_settings: {
            meta: {
                version: number;
            };
            rule_severities: Record<string, string>;
            defaults: {
                pads: {
                    width: number;
                    drill: number;
                    height: number;
                };
                apply_defaults_to_fp_fields: boolean;
                apply_defaults_to_fp_shapes: boolean;
                apply_defaults_to_fp_text: boolean;
                board_outline_line_width: number;
                copper_line_width: number;
                copper_text_italic: boolean;
                copper_text_size_h: number;
                copper_text_size_v: number;
                copper_text_thickness: number;
                copper_text_upright: boolean;
                courtyard_line_width: number;
                dimension_precision: number;
                dimension_units: number;
                dimensions: {
                    arrow_length: number;
                    extension_offset: number;
                    keep_text_aligned: boolean;
                    suppress_zeroes: boolean;
                    text_position: number;
                    units_format: number;
                };
                fab_line_width: number;
                fab_text_italic: boolean;
                fab_text_size_h: number;
                fab_text_size_v: number;
                fab_text_thickness: number;
                fab_text_upright: boolean;
                other_line_width: number;
                other_text_italic: boolean;
                other_text_size_h: number;
                other_text_size_v: number;
                other_text_thickness: number;
                other_text_upright: boolean;
                silk_line_width: number;
                silk_text_italic: boolean;
                silk_text_size_h: number;
                silk_text_size_v: number;
                silk_text_thickness: number;
                silk_text_upright: boolean;
                zones: {
                    min_clearance: number;
                };
            };
            diff_pair_dimensions: any[];
            drc_exclusions: any[];
            rules: {
                min_clearance: number;
                max_error: number;
                min_connection: number;
                min_copper_edge_clearance: number;
                min_hole_clearance: number;
                min_hole_to_hole: number;
                min_microvia_diameter: number;
                min_microvia_drill: number;
                min_resolved_spokes: number;
                min_silk_clearance: number;
                min_text_height: number;
                min_text_thickness: number;
                min_through_hole_diameter: number;
                min_track_width: number;
                min_via_annular_width: number;
                min_via_diameter: number;
                solder_mask_to_copper_clearance: number;
                use_height_for_length_calcs: boolean;
            };
            teardrop_options: {
                td_onpadsmd: boolean;
                td_onroundshapesonly: boolean;
                td_ontrackend: boolean;
                td_onviapad: boolean;
            }[];
            teardrop_parameters: {
                td_allow_use_two_tracks: boolean;
                td_curve_segcount: number;
                td_height_ratio: number;
                td_length_ratio: number;
                td_maxheight: number;
                td_maxlen: number;
                td_on_pad_in_zone: boolean;
                td_target_name: string;
                td_width_to_size_filter_ratio: number;
            }[];
            track_widths: any[];
            tuning_pattern_settings: {
                diff_pair_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                diff_pair_skew_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
                single_track_defaults: {
                    corner_radius_percentage: number;
                    corner_style: number;
                    max_amplitude: number;
                    min_amplitude: number;
                    single_sided: boolean;
                    spacing: number;
                };
            };
            via_dimensions: any[];
            zones_allow_external_fillets: boolean;
        };
        ipc2581: {
            dist: string;
            distpn: string;
            internal_id: string;
            mfg: string;
            mpn: string;
        };
        layer_presets: any[];
        viewports: any[];
    };
    boards: any[];
    cvpcb: {
        equivalence_files: any[];
    };
    erc: {
        erc_exclusions: any[];
        meta: {
            version: number;
        };
        pin_map: number[][];
        rule_severities: Record<string, string>;
    };
    libraries: {
        pinned_footprint_libs: any[];
        pinned_symbol_libs: any[];
    };
    net_settings: {
        meta: {
            version: number;
        };
        classes: {
            name: string;
            clearance: number;
            track_width: number;
            bus_width: number;
            diff_pair_gap: number;
            diff_pair_via_gap: number;
            diff_pair_width: number;
            line_style: number;
            microvia_diameter: number;
            microvia_drill: number;
            pcb_color: string;
            schematic_color: string;
            via_diameter: number;
            via_drill: number;
            wire_width: number;
        }[];
        netclass_patterns: any[];
        net_colors?: any;
        netclass_assignments?: any;
    };
    pcbnew: {
        last_paths: {
            gencad: string;
            idf: string;
            netlist: string;
            plot: string;
            pos_files: string;
            specctra_dsn: string;
            step: string;
            svg: string;
            vrml: string;
        };
        page_layout_descr_file: string;
    };
    schematic: {
        meta: {
            version: number;
        };
        page_layout_descr_file: string;
        annotate_start_num: number;
        bom_export_filename: string;
        bom_fmt_presets: any[];
        bom_fmt_settings: {
            name: string;
            field_delimiter: string;
            keep_line_breaks: boolean;
            keep_tabs: boolean;
            ref_delimiter: string;
            ref_range_delimiter: string;
            string_delimiter: string;
        };
        bom_presets: any[];
        bom_settings: {
            name: string;
            exclude_dnp: boolean;
            fields_ordered: {
                name: string;
                group_by: boolean;
                label: string;
                show: boolean;
            }[];
            filter_string: string;
            group_symbols: boolean;
            sort_asc: boolean;
            sort_field: string;
        };
        connection_grid_size: number;
        drawing: {
            dashed_lines_dash_length_ratio: number;
            dashed_lines_gap_length_ratio: number;
            default_line_thickness: number;
            default_text_size: number;
            field_names: any[];
            intersheets_ref_own_page: boolean;
            intersheets_ref_prefix: string;
            intersheets_ref_short: boolean;
            intersheets_ref_show: boolean;
            intersheets_ref_suffix: string;
            junction_size_choice: number;
            label_size_ratio: number;
            operating_point_overlay_i_precision: number;
            operating_point_overlay_i_range: string;
            operating_point_overlay_v_precision: number;
            operating_point_overlay_v_range: string;
            overbar_offset_ratio: number;
            pin_symbol_size: number;
            text_offset_ratio: number;
        };
        legacy_lib_dir: string;
        legacy_lib_list: any[];
        net_format_name: string;
        plot_directory: string;
        spice_current_sheet_as_root: boolean;
        spice_external_command: string;
        spice_model_current_sheet_as_root: boolean;
        spice_save_all_currents: boolean;
        spice_save_all_dissipations: boolean;
        spice_save_all_voltages: boolean;
        subpart_first_id: number;
        subpart_id_separator: number;
    };
    sheets: [string, string][];
    text_variables?: any;
}>;

interface KicadSch$1 {
    version: number;
    generator: string;
    generator_version: string;
    uuid: string;
    paper: string;
    lib_symbols?: LibSymbols;
    wires?: Wire[];
    symbols?: SymbolInstance[];
    sheet_instances?: SheetInstances;
}
interface LibSymbols {
    symbols: SymbolDefinition[];
}
interface SymbolDefinition {
    name: string;
    pin_numbers?: PinNumbers;
    pin_names?: PinNames;
    exclude_from_sim?: YesNo;
    in_bom?: YesNo;
    on_board?: YesNo;
    properties?: Property[];
    symbols?: SubSymbol[];
}
interface PinNumbers {
    hide?: boolean;
}
interface PinNames {
    offset: number;
}
interface Property {
    name: string;
    value: string;
    at?: At;
    effects?: Effects;
}
interface At {
    x: number;
    y: number;
    rotation?: number;
}
interface Effects {
    font?: Font;
    justify?: string;
    hide?: boolean;
}
interface Font {
    size: [number, number];
}
interface SubSymbol {
    name: string;
    polylines?: Polyline[];
    rectangles?: Rectangle[];
    pins?: Pin[];
}
interface Polyline {
    pts: Point[];
    stroke: Stroke;
    fill: Fill;
}
interface Rectangle {
    start: Point;
    end: Point;
    stroke: Stroke;
    fill: Fill;
}
interface Pin {
    type: string;
    shape: string;
    at: At;
    length: number;
    name: PinName;
    number: PinNumber;
}
interface PinName {
    name: string;
    effects?: Effects;
}
interface PinNumber {
    number: string;
    effects?: Effects;
}
interface Stroke {
    width: number;
    type?: string;
}
interface Fill {
    type: string;
}
interface Point {
    x: number;
    y: number;
}
interface SymbolInstance {
    lib_id: string;
    at: At;
    unit: number;
    exclude_from_sim?: YesNo;
    in_bom?: YesNo;
    on_board?: YesNo;
    dnp?: YesNo;
    fields_autoplaced?: YesNo;
    uuid?: string;
    properties?: Property[];
    pins?: SymbolPin[];
    instances?: Instances;
}
interface SymbolPin {
    number: string;
    uuid?: string;
}
interface Instances {
    project: ProjectInstance;
}
interface ProjectInstance {
    name: string;
    path: PathInstance;
}
interface PathInstance {
    path: string;
    reference: string;
    unit: number;
}
interface Wire {
    pts: Point[];
    stroke: Stroke;
    uuid?: string;
}
interface SheetInstances {
    path: SheetPath;
}
interface SheetPath {
    path: string;
    page: string;
}
type YesNo = "yes" | "no";

declare const KicadSch: {
    parseKicadSch(sexpr: SExpr): KicadSch$1;
    KicadSchSchema: zod.ZodObject<{
        version: zod.ZodNumber;
        generator: zod.ZodString;
        generator_version: zod.ZodString;
        uuid: zod.ZodString;
        paper: zod.ZodString;
        lib_symbols: zod.ZodOptional<zod.ZodObject<{
            symbols: zod.ZodArray<zod.ZodObject<{
                name: zod.ZodString;
                pin_numbers: zod.ZodOptional<zod.ZodObject<{
                    hide: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    hide?: boolean | undefined;
                }, {
                    hide?: boolean | undefined;
                }>>;
                pin_names: zod.ZodOptional<zod.ZodObject<{
                    offset: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    offset: number;
                }, {
                    offset: number;
                }>>;
                exclude_from_sim: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
                in_bom: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
                on_board: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
                properties: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                    name: zod.ZodString;
                    value: zod.ZodString;
                    at: zod.ZodOptional<zod.ZodObject<{
                        x: zod.ZodNumber;
                        y: zod.ZodNumber;
                        rotation: zod.ZodOptional<zod.ZodNumber>;
                    }, "strip", zod.ZodTypeAny, {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    }, {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    }>>;
                    effects: zod.ZodOptional<zod.ZodObject<{
                        font: zod.ZodOptional<zod.ZodObject<{
                            size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                        }, "strip", zod.ZodTypeAny, {
                            size: [number, number];
                        }, {
                            size: [number, number];
                        }>>;
                        justify: zod.ZodOptional<zod.ZodString>;
                        hide: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    }, {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    }>>;
                }, "strip", zod.ZodTypeAny, {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }, {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }>, "many">>;
                symbols: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                    name: zod.ZodString;
                    polylines: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                        pts: zod.ZodArray<zod.ZodObject<{
                            x: zod.ZodNumber;
                            y: zod.ZodNumber;
                        }, "strip", zod.ZodTypeAny, {
                            x: number;
                            y: number;
                        }, {
                            x: number;
                            y: number;
                        }>, "many">;
                        stroke: zod.ZodObject<{
                            width: zod.ZodNumber;
                            type: zod.ZodOptional<zod.ZodString>;
                        }, "strip", zod.ZodTypeAny, {
                            width: number;
                            type?: string | undefined;
                        }, {
                            width: number;
                            type?: string | undefined;
                        }>;
                        fill: zod.ZodObject<{
                            type: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            type: string;
                        }, {
                            type: string;
                        }>;
                    }, "strip", zod.ZodTypeAny, {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }, {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }>, "many">>;
                    rectangles: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                        start: zod.ZodObject<{
                            x: zod.ZodNumber;
                            y: zod.ZodNumber;
                        }, "strip", zod.ZodTypeAny, {
                            x: number;
                            y: number;
                        }, {
                            x: number;
                            y: number;
                        }>;
                        end: zod.ZodObject<{
                            x: zod.ZodNumber;
                            y: zod.ZodNumber;
                        }, "strip", zod.ZodTypeAny, {
                            x: number;
                            y: number;
                        }, {
                            x: number;
                            y: number;
                        }>;
                        stroke: zod.ZodObject<{
                            width: zod.ZodNumber;
                            type: zod.ZodOptional<zod.ZodString>;
                        }, "strip", zod.ZodTypeAny, {
                            width: number;
                            type?: string | undefined;
                        }, {
                            width: number;
                            type?: string | undefined;
                        }>;
                        fill: zod.ZodObject<{
                            type: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            type: string;
                        }, {
                            type: string;
                        }>;
                    }, "strip", zod.ZodTypeAny, {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }, {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }>, "many">>;
                    pins: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                        type: zod.ZodString;
                        shape: zod.ZodString;
                        at: zod.ZodObject<{
                            x: zod.ZodNumber;
                            y: zod.ZodNumber;
                            rotation: zod.ZodOptional<zod.ZodNumber>;
                        }, "strip", zod.ZodTypeAny, {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        }, {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        }>;
                        length: zod.ZodNumber;
                        name: zod.ZodObject<{
                            name: zod.ZodString;
                            effects: zod.ZodOptional<zod.ZodObject<{
                                font: zod.ZodOptional<zod.ZodObject<{
                                    size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                                }, "strip", zod.ZodTypeAny, {
                                    size: [number, number];
                                }, {
                                    size: [number, number];
                                }>>;
                                justify: zod.ZodOptional<zod.ZodString>;
                                hide: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            }, {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            }>>;
                        }, "strip", zod.ZodTypeAny, {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        }, {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        }>;
                        number: zod.ZodObject<{
                            number: zod.ZodString;
                            effects: zod.ZodOptional<zod.ZodObject<{
                                font: zod.ZodOptional<zod.ZodObject<{
                                    size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                                }, "strip", zod.ZodTypeAny, {
                                    size: [number, number];
                                }, {
                                    size: [number, number];
                                }>>;
                                justify: zod.ZodOptional<zod.ZodString>;
                                hide: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            }, {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            }>>;
                        }, "strip", zod.ZodTypeAny, {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        }, {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        }>;
                    }, "strip", zod.ZodTypeAny, {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }, {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }>, "many">>;
                }, "strip", zod.ZodTypeAny, {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }, {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }>, "many">>;
            }, "strip", zod.ZodTypeAny, {
                name: string;
                properties?: {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }[] | undefined;
                pin_numbers?: {
                    hide?: boolean | undefined;
                } | undefined;
                pin_names?: {
                    offset: number;
                } | undefined;
                exclude_from_sim?: "yes" | "no" | undefined;
                in_bom?: "yes" | "no" | undefined;
                on_board?: "yes" | "no" | undefined;
                symbols?: {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }[] | undefined;
            }, {
                name: string;
                properties?: {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }[] | undefined;
                pin_numbers?: {
                    hide?: boolean | undefined;
                } | undefined;
                pin_names?: {
                    offset: number;
                } | undefined;
                exclude_from_sim?: "yes" | "no" | undefined;
                in_bom?: "yes" | "no" | undefined;
                on_board?: "yes" | "no" | undefined;
                symbols?: {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }[] | undefined;
            }>, "many">;
        }, "strip", zod.ZodTypeAny, {
            symbols: {
                name: string;
                properties?: {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }[] | undefined;
                pin_numbers?: {
                    hide?: boolean | undefined;
                } | undefined;
                pin_names?: {
                    offset: number;
                } | undefined;
                exclude_from_sim?: "yes" | "no" | undefined;
                in_bom?: "yes" | "no" | undefined;
                on_board?: "yes" | "no" | undefined;
                symbols?: {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }[] | undefined;
            }[];
        }, {
            symbols: {
                name: string;
                properties?: {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }[] | undefined;
                pin_numbers?: {
                    hide?: boolean | undefined;
                } | undefined;
                pin_names?: {
                    offset: number;
                } | undefined;
                exclude_from_sim?: "yes" | "no" | undefined;
                in_bom?: "yes" | "no" | undefined;
                on_board?: "yes" | "no" | undefined;
                symbols?: {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }[] | undefined;
            }[];
        }>>;
        wires: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            pts: zod.ZodArray<zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>, "many">;
            stroke: zod.ZodObject<{
                width: zod.ZodNumber;
                type: zod.ZodOptional<zod.ZodString>;
            }, "strip", zod.ZodTypeAny, {
                width: number;
                type?: string | undefined;
            }, {
                width: number;
                type?: string | undefined;
            }>;
            uuid: zod.ZodOptional<zod.ZodString>;
        }, "strip", zod.ZodTypeAny, {
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
            uuid?: string | undefined;
        }, {
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
            uuid?: string | undefined;
        }>, "many">>;
        symbols: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            lib_id: zod.ZodString;
            at: zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
                rotation: zod.ZodOptional<zod.ZodNumber>;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }>;
            unit: zod.ZodNumber;
            exclude_from_sim: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            in_bom: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            on_board: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            dnp: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            fields_autoplaced: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            uuid: zod.ZodOptional<zod.ZodString>;
            properties: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                name: zod.ZodString;
                value: zod.ZodString;
                at: zod.ZodOptional<zod.ZodObject<{
                    x: zod.ZodNumber;
                    y: zod.ZodNumber;
                    rotation: zod.ZodOptional<zod.ZodNumber>;
                }, "strip", zod.ZodTypeAny, {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                }, {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                }>>;
                effects: zod.ZodOptional<zod.ZodObject<{
                    font: zod.ZodOptional<zod.ZodObject<{
                        size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                    }, "strip", zod.ZodTypeAny, {
                        size: [number, number];
                    }, {
                        size: [number, number];
                    }>>;
                    justify: zod.ZodOptional<zod.ZodString>;
                    hide: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }>>;
            }, "strip", zod.ZodTypeAny, {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }, {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }>, "many">>;
            pins: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                number: zod.ZodString;
                uuid: zod.ZodOptional<zod.ZodString>;
            }, "strip", zod.ZodTypeAny, {
                number: string;
                uuid?: string | undefined;
            }, {
                number: string;
                uuid?: string | undefined;
            }>, "many">>;
            instances: zod.ZodOptional<zod.ZodObject<{
                project: zod.ZodObject<{
                    name: zod.ZodString;
                    path: zod.ZodObject<{
                        path: zod.ZodString;
                        reference: zod.ZodString;
                        unit: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        path: string;
                        reference: string;
                        unit: number;
                    }, {
                        path: string;
                        reference: string;
                        unit: number;
                    }>;
                }, "strip", zod.ZodTypeAny, {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                }, {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                }>;
            }, "strip", zod.ZodTypeAny, {
                project: {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                };
            }, {
                project: {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                };
            }>>;
        }, "strip", zod.ZodTypeAny, {
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            unit: number;
            lib_id: string;
            uuid?: string | undefined;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pins?: {
                number: string;
                uuid?: string | undefined;
            }[] | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            dnp?: "yes" | "no" | undefined;
            fields_autoplaced?: "yes" | "no" | undefined;
            instances?: {
                project: {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                };
            } | undefined;
        }, {
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            unit: number;
            lib_id: string;
            uuid?: string | undefined;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pins?: {
                number: string;
                uuid?: string | undefined;
            }[] | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            dnp?: "yes" | "no" | undefined;
            fields_autoplaced?: "yes" | "no" | undefined;
            instances?: {
                project: {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                };
            } | undefined;
        }>, "many">>;
        sheet_instances: zod.ZodOptional<zod.ZodObject<{
            path: zod.ZodObject<{
                path: zod.ZodString;
                page: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                path: string;
                page: string;
            }, {
                path: string;
                page: string;
            }>;
        }, "strip", zod.ZodTypeAny, {
            path: {
                path: string;
                page: string;
            };
        }, {
            path: {
                path: string;
                page: string;
            };
        }>>;
    }, "strip", zod.ZodTypeAny, {
        version: number;
        generator: string;
        generator_version: string;
        paper: string;
        uuid: string;
        symbols?: {
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            unit: number;
            lib_id: string;
            uuid?: string | undefined;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pins?: {
                number: string;
                uuid?: string | undefined;
            }[] | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            dnp?: "yes" | "no" | undefined;
            fields_autoplaced?: "yes" | "no" | undefined;
            instances?: {
                project: {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                };
            } | undefined;
        }[] | undefined;
        lib_symbols?: {
            symbols: {
                name: string;
                properties?: {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }[] | undefined;
                pin_numbers?: {
                    hide?: boolean | undefined;
                } | undefined;
                pin_names?: {
                    offset: number;
                } | undefined;
                exclude_from_sim?: "yes" | "no" | undefined;
                in_bom?: "yes" | "no" | undefined;
                on_board?: "yes" | "no" | undefined;
                symbols?: {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }[] | undefined;
            }[];
        } | undefined;
        wires?: {
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
            uuid?: string | undefined;
        }[] | undefined;
        sheet_instances?: {
            path: {
                path: string;
                page: string;
            };
        } | undefined;
    }, {
        version: number;
        generator: string;
        generator_version: string;
        paper: string;
        uuid: string;
        symbols?: {
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            unit: number;
            lib_id: string;
            uuid?: string | undefined;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pins?: {
                number: string;
                uuid?: string | undefined;
            }[] | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            dnp?: "yes" | "no" | undefined;
            fields_autoplaced?: "yes" | "no" | undefined;
            instances?: {
                project: {
                    name: string;
                    path: {
                        path: string;
                        reference: string;
                        unit: number;
                    };
                };
            } | undefined;
        }[] | undefined;
        lib_symbols?: {
            symbols: {
                name: string;
                properties?: {
                    name: string;
                    value: string;
                    at?: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    } | undefined;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }[] | undefined;
                pin_numbers?: {
                    hide?: boolean | undefined;
                } | undefined;
                pin_names?: {
                    offset: number;
                } | undefined;
                exclude_from_sim?: "yes" | "no" | undefined;
                in_bom?: "yes" | "no" | undefined;
                on_board?: "yes" | "no" | undefined;
                symbols?: {
                    name: string;
                    polylines?: {
                        fill: {
                            type: string;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                        pts: {
                            x: number;
                            y: number;
                        }[];
                    }[] | undefined;
                    rectangles?: {
                        fill: {
                            type: string;
                        };
                        start: {
                            x: number;
                            y: number;
                        };
                        end: {
                            x: number;
                            y: number;
                        };
                        stroke: {
                            width: number;
                            type?: string | undefined;
                        };
                    }[] | undefined;
                    pins?: {
                        number: {
                            number: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        type: string;
                        name: {
                            name: string;
                            effects?: {
                                font?: {
                                    size: [number, number];
                                } | undefined;
                                hide?: boolean | undefined;
                                justify?: string | undefined;
                            } | undefined;
                        };
                        length: number;
                        at: {
                            x: number;
                            y: number;
                            rotation?: number | undefined;
                        };
                        shape: string;
                    }[] | undefined;
                }[] | undefined;
            }[];
        } | undefined;
        wires?: {
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
            uuid?: string | undefined;
        }[] | undefined;
        sheet_instances?: {
            path: {
                path: string;
                page: string;
            };
        } | undefined;
    }>;
    YesNoSchema: zod.ZodEnum<["yes", "no"]>;
    PointSchema: zod.ZodObject<{
        x: zod.ZodNumber;
        y: zod.ZodNumber;
    }, "strip", zod.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>;
    AtSchema: zod.ZodObject<{
        x: zod.ZodNumber;
        y: zod.ZodNumber;
        rotation: zod.ZodOptional<zod.ZodNumber>;
    }, "strip", zod.ZodTypeAny, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }, {
        x: number;
        y: number;
        rotation?: number | undefined;
    }>;
    FontSchema: zod.ZodObject<{
        size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
    }, "strip", zod.ZodTypeAny, {
        size: [number, number];
    }, {
        size: [number, number];
    }>;
    EffectsSchema: zod.ZodObject<{
        font: zod.ZodOptional<zod.ZodObject<{
            size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
        }, "strip", zod.ZodTypeAny, {
            size: [number, number];
        }, {
            size: [number, number];
        }>>;
        justify: zod.ZodOptional<zod.ZodString>;
        hide: zod.ZodOptional<zod.ZodBoolean>;
    }, "strip", zod.ZodTypeAny, {
        font?: {
            size: [number, number];
        } | undefined;
        hide?: boolean | undefined;
        justify?: string | undefined;
    }, {
        font?: {
            size: [number, number];
        } | undefined;
        hide?: boolean | undefined;
        justify?: string | undefined;
    }>;
    PinNameSchema: zod.ZodObject<{
        name: zod.ZodString;
        effects: zod.ZodOptional<zod.ZodObject<{
            font: zod.ZodOptional<zod.ZodObject<{
                size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
            }, "strip", zod.ZodTypeAny, {
                size: [number, number];
            }, {
                size: [number, number];
            }>>;
            justify: zod.ZodOptional<zod.ZodString>;
            hide: zod.ZodOptional<zod.ZodBoolean>;
        }, "strip", zod.ZodTypeAny, {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        }, {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        }>>;
    }, "strip", zod.ZodTypeAny, {
        name: string;
        effects?: {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        } | undefined;
    }, {
        name: string;
        effects?: {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        } | undefined;
    }>;
    PinNumberSchema: zod.ZodObject<{
        number: zod.ZodString;
        effects: zod.ZodOptional<zod.ZodObject<{
            font: zod.ZodOptional<zod.ZodObject<{
                size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
            }, "strip", zod.ZodTypeAny, {
                size: [number, number];
            }, {
                size: [number, number];
            }>>;
            justify: zod.ZodOptional<zod.ZodString>;
            hide: zod.ZodOptional<zod.ZodBoolean>;
        }, "strip", zod.ZodTypeAny, {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        }, {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        }>>;
    }, "strip", zod.ZodTypeAny, {
        number: string;
        effects?: {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        } | undefined;
    }, {
        number: string;
        effects?: {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        } | undefined;
    }>;
    StrokeSchema: zod.ZodObject<{
        width: zod.ZodNumber;
        type: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
        width: number;
        type?: string | undefined;
    }, {
        width: number;
        type?: string | undefined;
    }>;
    FillSchema: zod.ZodObject<{
        type: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        type: string;
    }, {
        type: string;
    }>;
    PolylineSchema: zod.ZodObject<{
        pts: zod.ZodArray<zod.ZodObject<{
            x: zod.ZodNumber;
            y: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">;
        stroke: zod.ZodObject<{
            width: zod.ZodNumber;
            type: zod.ZodOptional<zod.ZodString>;
        }, "strip", zod.ZodTypeAny, {
            width: number;
            type?: string | undefined;
        }, {
            width: number;
            type?: string | undefined;
        }>;
        fill: zod.ZodObject<{
            type: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            type: string;
        }, {
            type: string;
        }>;
    }, "strip", zod.ZodTypeAny, {
        fill: {
            type: string;
        };
        stroke: {
            width: number;
            type?: string | undefined;
        };
        pts: {
            x: number;
            y: number;
        }[];
    }, {
        fill: {
            type: string;
        };
        stroke: {
            width: number;
            type?: string | undefined;
        };
        pts: {
            x: number;
            y: number;
        }[];
    }>;
    RectangleSchema: zod.ZodObject<{
        start: zod.ZodObject<{
            x: zod.ZodNumber;
            y: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>;
        end: zod.ZodObject<{
            x: zod.ZodNumber;
            y: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>;
        stroke: zod.ZodObject<{
            width: zod.ZodNumber;
            type: zod.ZodOptional<zod.ZodString>;
        }, "strip", zod.ZodTypeAny, {
            width: number;
            type?: string | undefined;
        }, {
            width: number;
            type?: string | undefined;
        }>;
        fill: zod.ZodObject<{
            type: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            type: string;
        }, {
            type: string;
        }>;
    }, "strip", zod.ZodTypeAny, {
        fill: {
            type: string;
        };
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
        stroke: {
            width: number;
            type?: string | undefined;
        };
    }, {
        fill: {
            type: string;
        };
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
        stroke: {
            width: number;
            type?: string | undefined;
        };
    }>;
    PinSchema: zod.ZodObject<{
        type: zod.ZodString;
        shape: zod.ZodString;
        at: zod.ZodObject<{
            x: zod.ZodNumber;
            y: zod.ZodNumber;
            rotation: zod.ZodOptional<zod.ZodNumber>;
        }, "strip", zod.ZodTypeAny, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }>;
        length: zod.ZodNumber;
        name: zod.ZodObject<{
            name: zod.ZodString;
            effects: zod.ZodOptional<zod.ZodObject<{
                font: zod.ZodOptional<zod.ZodObject<{
                    size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                }, "strip", zod.ZodTypeAny, {
                    size: [number, number];
                }, {
                    size: [number, number];
                }>>;
                justify: zod.ZodOptional<zod.ZodString>;
                hide: zod.ZodOptional<zod.ZodBoolean>;
            }, "strip", zod.ZodTypeAny, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }>>;
        }, "strip", zod.ZodTypeAny, {
            name: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }, {
            name: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }>;
        number: zod.ZodObject<{
            number: zod.ZodString;
            effects: zod.ZodOptional<zod.ZodObject<{
                font: zod.ZodOptional<zod.ZodObject<{
                    size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                }, "strip", zod.ZodTypeAny, {
                    size: [number, number];
                }, {
                    size: [number, number];
                }>>;
                justify: zod.ZodOptional<zod.ZodString>;
                hide: zod.ZodOptional<zod.ZodBoolean>;
            }, "strip", zod.ZodTypeAny, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }>>;
        }, "strip", zod.ZodTypeAny, {
            number: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }, {
            number: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }>;
    }, "strip", zod.ZodTypeAny, {
        number: {
            number: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        };
        type: string;
        name: {
            name: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        };
        length: number;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        shape: string;
    }, {
        number: {
            number: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        };
        type: string;
        name: {
            name: string;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        };
        length: number;
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        shape: string;
    }>;
    SubSymbolSchema: zod.ZodObject<{
        name: zod.ZodString;
        polylines: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            pts: zod.ZodArray<zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>, "many">;
            stroke: zod.ZodObject<{
                width: zod.ZodNumber;
                type: zod.ZodOptional<zod.ZodString>;
            }, "strip", zod.ZodTypeAny, {
                width: number;
                type?: string | undefined;
            }, {
                width: number;
                type?: string | undefined;
            }>;
            fill: zod.ZodObject<{
                type: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                type: string;
            }, {
                type: string;
            }>;
        }, "strip", zod.ZodTypeAny, {
            fill: {
                type: string;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
        }, {
            fill: {
                type: string;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
        }>, "many">>;
        rectangles: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            start: zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>;
            end: zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>;
            stroke: zod.ZodObject<{
                width: zod.ZodNumber;
                type: zod.ZodOptional<zod.ZodString>;
            }, "strip", zod.ZodTypeAny, {
                width: number;
                type?: string | undefined;
            }, {
                width: number;
                type?: string | undefined;
            }>;
            fill: zod.ZodObject<{
                type: zod.ZodString;
            }, "strip", zod.ZodTypeAny, {
                type: string;
            }, {
                type: string;
            }>;
        }, "strip", zod.ZodTypeAny, {
            fill: {
                type: string;
            };
            start: {
                x: number;
                y: number;
            };
            end: {
                x: number;
                y: number;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
        }, {
            fill: {
                type: string;
            };
            start: {
                x: number;
                y: number;
            };
            end: {
                x: number;
                y: number;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
        }>, "many">>;
        pins: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            type: zod.ZodString;
            shape: zod.ZodString;
            at: zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
                rotation: zod.ZodOptional<zod.ZodNumber>;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }>;
            length: zod.ZodNumber;
            name: zod.ZodObject<{
                name: zod.ZodString;
                effects: zod.ZodOptional<zod.ZodObject<{
                    font: zod.ZodOptional<zod.ZodObject<{
                        size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                    }, "strip", zod.ZodTypeAny, {
                        size: [number, number];
                    }, {
                        size: [number, number];
                    }>>;
                    justify: zod.ZodOptional<zod.ZodString>;
                    hide: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }>>;
            }, "strip", zod.ZodTypeAny, {
                name: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }, {
                name: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }>;
            number: zod.ZodObject<{
                number: zod.ZodString;
                effects: zod.ZodOptional<zod.ZodObject<{
                    font: zod.ZodOptional<zod.ZodObject<{
                        size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                    }, "strip", zod.ZodTypeAny, {
                        size: [number, number];
                    }, {
                        size: [number, number];
                    }>>;
                    justify: zod.ZodOptional<zod.ZodString>;
                    hide: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }>>;
            }, "strip", zod.ZodTypeAny, {
                number: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }, {
                number: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }>;
        }, "strip", zod.ZodTypeAny, {
            number: {
                number: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            type: string;
            name: {
                name: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            length: number;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            shape: string;
        }, {
            number: {
                number: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            type: string;
            name: {
                name: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            length: number;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            shape: string;
        }>, "many">>;
    }, "strip", zod.ZodTypeAny, {
        name: string;
        polylines?: {
            fill: {
                type: string;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
        }[] | undefined;
        rectangles?: {
            fill: {
                type: string;
            };
            start: {
                x: number;
                y: number;
            };
            end: {
                x: number;
                y: number;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
        }[] | undefined;
        pins?: {
            number: {
                number: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            type: string;
            name: {
                name: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            length: number;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            shape: string;
        }[] | undefined;
    }, {
        name: string;
        polylines?: {
            fill: {
                type: string;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
            pts: {
                x: number;
                y: number;
            }[];
        }[] | undefined;
        rectangles?: {
            fill: {
                type: string;
            };
            start: {
                x: number;
                y: number;
            };
            end: {
                x: number;
                y: number;
            };
            stroke: {
                width: number;
                type?: string | undefined;
            };
        }[] | undefined;
        pins?: {
            number: {
                number: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            type: string;
            name: {
                name: string;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            };
            length: number;
            at: {
                x: number;
                y: number;
                rotation?: number | undefined;
            };
            shape: string;
        }[] | undefined;
    }>;
    PropertySchema: zod.ZodObject<{
        name: zod.ZodString;
        value: zod.ZodString;
        at: zod.ZodOptional<zod.ZodObject<{
            x: zod.ZodNumber;
            y: zod.ZodNumber;
            rotation: zod.ZodOptional<zod.ZodNumber>;
        }, "strip", zod.ZodTypeAny, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }>>;
        effects: zod.ZodOptional<zod.ZodObject<{
            font: zod.ZodOptional<zod.ZodObject<{
                size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
            }, "strip", zod.ZodTypeAny, {
                size: [number, number];
            }, {
                size: [number, number];
            }>>;
            justify: zod.ZodOptional<zod.ZodString>;
            hide: zod.ZodOptional<zod.ZodBoolean>;
        }, "strip", zod.ZodTypeAny, {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        }, {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        }>>;
    }, "strip", zod.ZodTypeAny, {
        name: string;
        value: string;
        at?: {
            x: number;
            y: number;
            rotation?: number | undefined;
        } | undefined;
        effects?: {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        } | undefined;
    }, {
        name: string;
        value: string;
        at?: {
            x: number;
            y: number;
            rotation?: number | undefined;
        } | undefined;
        effects?: {
            font?: {
                size: [number, number];
            } | undefined;
            hide?: boolean | undefined;
            justify?: string | undefined;
        } | undefined;
    }>;
    PinNumbersSchema: zod.ZodObject<{
        hide: zod.ZodOptional<zod.ZodBoolean>;
    }, "strip", zod.ZodTypeAny, {
        hide?: boolean | undefined;
    }, {
        hide?: boolean | undefined;
    }>;
    PinNamesSchema: zod.ZodObject<{
        offset: zod.ZodNumber;
    }, "strip", zod.ZodTypeAny, {
        offset: number;
    }, {
        offset: number;
    }>;
    SymbolDefinitionSchema: zod.ZodObject<{
        name: zod.ZodString;
        pin_numbers: zod.ZodOptional<zod.ZodObject<{
            hide: zod.ZodOptional<zod.ZodBoolean>;
        }, "strip", zod.ZodTypeAny, {
            hide?: boolean | undefined;
        }, {
            hide?: boolean | undefined;
        }>>;
        pin_names: zod.ZodOptional<zod.ZodObject<{
            offset: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            offset: number;
        }, {
            offset: number;
        }>>;
        exclude_from_sim: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        in_bom: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        on_board: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        properties: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            name: zod.ZodString;
            value: zod.ZodString;
            at: zod.ZodOptional<zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
                rotation: zod.ZodOptional<zod.ZodNumber>;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }>>;
            effects: zod.ZodOptional<zod.ZodObject<{
                font: zod.ZodOptional<zod.ZodObject<{
                    size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                }, "strip", zod.ZodTypeAny, {
                    size: [number, number];
                }, {
                    size: [number, number];
                }>>;
                justify: zod.ZodOptional<zod.ZodString>;
                hide: zod.ZodOptional<zod.ZodBoolean>;
            }, "strip", zod.ZodTypeAny, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }>>;
        }, "strip", zod.ZodTypeAny, {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }, {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }>, "many">>;
        symbols: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            name: zod.ZodString;
            polylines: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                pts: zod.ZodArray<zod.ZodObject<{
                    x: zod.ZodNumber;
                    y: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    x: number;
                    y: number;
                }, {
                    x: number;
                    y: number;
                }>, "many">;
                stroke: zod.ZodObject<{
                    width: zod.ZodNumber;
                    type: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    width: number;
                    type?: string | undefined;
                }, {
                    width: number;
                    type?: string | undefined;
                }>;
                fill: zod.ZodObject<{
                    type: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    type: string;
                }, {
                    type: string;
                }>;
            }, "strip", zod.ZodTypeAny, {
                fill: {
                    type: string;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
                pts: {
                    x: number;
                    y: number;
                }[];
            }, {
                fill: {
                    type: string;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
                pts: {
                    x: number;
                    y: number;
                }[];
            }>, "many">>;
            rectangles: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                start: zod.ZodObject<{
                    x: zod.ZodNumber;
                    y: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    x: number;
                    y: number;
                }, {
                    x: number;
                    y: number;
                }>;
                end: zod.ZodObject<{
                    x: zod.ZodNumber;
                    y: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    x: number;
                    y: number;
                }, {
                    x: number;
                    y: number;
                }>;
                stroke: zod.ZodObject<{
                    width: zod.ZodNumber;
                    type: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    width: number;
                    type?: string | undefined;
                }, {
                    width: number;
                    type?: string | undefined;
                }>;
                fill: zod.ZodObject<{
                    type: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    type: string;
                }, {
                    type: string;
                }>;
            }, "strip", zod.ZodTypeAny, {
                fill: {
                    type: string;
                };
                start: {
                    x: number;
                    y: number;
                };
                end: {
                    x: number;
                    y: number;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
            }, {
                fill: {
                    type: string;
                };
                start: {
                    x: number;
                    y: number;
                };
                end: {
                    x: number;
                    y: number;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
            }>, "many">>;
            pins: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                type: zod.ZodString;
                shape: zod.ZodString;
                at: zod.ZodObject<{
                    x: zod.ZodNumber;
                    y: zod.ZodNumber;
                    rotation: zod.ZodOptional<zod.ZodNumber>;
                }, "strip", zod.ZodTypeAny, {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                }, {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                }>;
                length: zod.ZodNumber;
                name: zod.ZodObject<{
                    name: zod.ZodString;
                    effects: zod.ZodOptional<zod.ZodObject<{
                        font: zod.ZodOptional<zod.ZodObject<{
                            size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                        }, "strip", zod.ZodTypeAny, {
                            size: [number, number];
                        }, {
                            size: [number, number];
                        }>>;
                        justify: zod.ZodOptional<zod.ZodString>;
                        hide: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    }, {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    }>>;
                }, "strip", zod.ZodTypeAny, {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }, {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }>;
                number: zod.ZodObject<{
                    number: zod.ZodString;
                    effects: zod.ZodOptional<zod.ZodObject<{
                        font: zod.ZodOptional<zod.ZodObject<{
                            size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                        }, "strip", zod.ZodTypeAny, {
                            size: [number, number];
                        }, {
                            size: [number, number];
                        }>>;
                        justify: zod.ZodOptional<zod.ZodString>;
                        hide: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    }, {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    }>>;
                }, "strip", zod.ZodTypeAny, {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }, {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                }>;
            }, "strip", zod.ZodTypeAny, {
                number: {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                type: string;
                name: {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                length: number;
                at: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                };
                shape: string;
            }, {
                number: {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                type: string;
                name: {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                length: number;
                at: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                };
                shape: string;
            }>, "many">>;
        }, "strip", zod.ZodTypeAny, {
            name: string;
            polylines?: {
                fill: {
                    type: string;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
                pts: {
                    x: number;
                    y: number;
                }[];
            }[] | undefined;
            rectangles?: {
                fill: {
                    type: string;
                };
                start: {
                    x: number;
                    y: number;
                };
                end: {
                    x: number;
                    y: number;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
            }[] | undefined;
            pins?: {
                number: {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                type: string;
                name: {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                length: number;
                at: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                };
                shape: string;
            }[] | undefined;
        }, {
            name: string;
            polylines?: {
                fill: {
                    type: string;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
                pts: {
                    x: number;
                    y: number;
                }[];
            }[] | undefined;
            rectangles?: {
                fill: {
                    type: string;
                };
                start: {
                    x: number;
                    y: number;
                };
                end: {
                    x: number;
                    y: number;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
            }[] | undefined;
            pins?: {
                number: {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                type: string;
                name: {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                length: number;
                at: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                };
                shape: string;
            }[] | undefined;
        }>, "many">>;
    }, "strip", zod.ZodTypeAny, {
        name: string;
        properties?: {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }[] | undefined;
        pin_numbers?: {
            hide?: boolean | undefined;
        } | undefined;
        pin_names?: {
            offset: number;
        } | undefined;
        exclude_from_sim?: "yes" | "no" | undefined;
        in_bom?: "yes" | "no" | undefined;
        on_board?: "yes" | "no" | undefined;
        symbols?: {
            name: string;
            polylines?: {
                fill: {
                    type: string;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
                pts: {
                    x: number;
                    y: number;
                }[];
            }[] | undefined;
            rectangles?: {
                fill: {
                    type: string;
                };
                start: {
                    x: number;
                    y: number;
                };
                end: {
                    x: number;
                    y: number;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
            }[] | undefined;
            pins?: {
                number: {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                type: string;
                name: {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                length: number;
                at: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                };
                shape: string;
            }[] | undefined;
        }[] | undefined;
    }, {
        name: string;
        properties?: {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }[] | undefined;
        pin_numbers?: {
            hide?: boolean | undefined;
        } | undefined;
        pin_names?: {
            offset: number;
        } | undefined;
        exclude_from_sim?: "yes" | "no" | undefined;
        in_bom?: "yes" | "no" | undefined;
        on_board?: "yes" | "no" | undefined;
        symbols?: {
            name: string;
            polylines?: {
                fill: {
                    type: string;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
                pts: {
                    x: number;
                    y: number;
                }[];
            }[] | undefined;
            rectangles?: {
                fill: {
                    type: string;
                };
                start: {
                    x: number;
                    y: number;
                };
                end: {
                    x: number;
                    y: number;
                };
                stroke: {
                    width: number;
                    type?: string | undefined;
                };
            }[] | undefined;
            pins?: {
                number: {
                    number: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                type: string;
                name: {
                    name: string;
                    effects?: {
                        font?: {
                            size: [number, number];
                        } | undefined;
                        hide?: boolean | undefined;
                        justify?: string | undefined;
                    } | undefined;
                };
                length: number;
                at: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                };
                shape: string;
            }[] | undefined;
        }[] | undefined;
    }>;
    LibSymbolsSchema: zod.ZodObject<{
        symbols: zod.ZodArray<zod.ZodObject<{
            name: zod.ZodString;
            pin_numbers: zod.ZodOptional<zod.ZodObject<{
                hide: zod.ZodOptional<zod.ZodBoolean>;
            }, "strip", zod.ZodTypeAny, {
                hide?: boolean | undefined;
            }, {
                hide?: boolean | undefined;
            }>>;
            pin_names: zod.ZodOptional<zod.ZodObject<{
                offset: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                offset: number;
            }, {
                offset: number;
            }>>;
            exclude_from_sim: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            in_bom: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            on_board: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
            properties: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                name: zod.ZodString;
                value: zod.ZodString;
                at: zod.ZodOptional<zod.ZodObject<{
                    x: zod.ZodNumber;
                    y: zod.ZodNumber;
                    rotation: zod.ZodOptional<zod.ZodNumber>;
                }, "strip", zod.ZodTypeAny, {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                }, {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                }>>;
                effects: zod.ZodOptional<zod.ZodObject<{
                    font: zod.ZodOptional<zod.ZodObject<{
                        size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                    }, "strip", zod.ZodTypeAny, {
                        size: [number, number];
                    }, {
                        size: [number, number];
                    }>>;
                    justify: zod.ZodOptional<zod.ZodString>;
                    hide: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }, {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                }>>;
            }, "strip", zod.ZodTypeAny, {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }, {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }>, "many">>;
            symbols: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                name: zod.ZodString;
                polylines: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                    pts: zod.ZodArray<zod.ZodObject<{
                        x: zod.ZodNumber;
                        y: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        x: number;
                        y: number;
                    }, {
                        x: number;
                        y: number;
                    }>, "many">;
                    stroke: zod.ZodObject<{
                        width: zod.ZodNumber;
                        type: zod.ZodOptional<zod.ZodString>;
                    }, "strip", zod.ZodTypeAny, {
                        width: number;
                        type?: string | undefined;
                    }, {
                        width: number;
                        type?: string | undefined;
                    }>;
                    fill: zod.ZodObject<{
                        type: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        type: string;
                    }, {
                        type: string;
                    }>;
                }, "strip", zod.ZodTypeAny, {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }, {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }>, "many">>;
                rectangles: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                    start: zod.ZodObject<{
                        x: zod.ZodNumber;
                        y: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        x: number;
                        y: number;
                    }, {
                        x: number;
                        y: number;
                    }>;
                    end: zod.ZodObject<{
                        x: zod.ZodNumber;
                        y: zod.ZodNumber;
                    }, "strip", zod.ZodTypeAny, {
                        x: number;
                        y: number;
                    }, {
                        x: number;
                        y: number;
                    }>;
                    stroke: zod.ZodObject<{
                        width: zod.ZodNumber;
                        type: zod.ZodOptional<zod.ZodString>;
                    }, "strip", zod.ZodTypeAny, {
                        width: number;
                        type?: string | undefined;
                    }, {
                        width: number;
                        type?: string | undefined;
                    }>;
                    fill: zod.ZodObject<{
                        type: zod.ZodString;
                    }, "strip", zod.ZodTypeAny, {
                        type: string;
                    }, {
                        type: string;
                    }>;
                }, "strip", zod.ZodTypeAny, {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }, {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }>, "many">>;
                pins: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
                    type: zod.ZodString;
                    shape: zod.ZodString;
                    at: zod.ZodObject<{
                        x: zod.ZodNumber;
                        y: zod.ZodNumber;
                        rotation: zod.ZodOptional<zod.ZodNumber>;
                    }, "strip", zod.ZodTypeAny, {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    }, {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    }>;
                    length: zod.ZodNumber;
                    name: zod.ZodObject<{
                        name: zod.ZodString;
                        effects: zod.ZodOptional<zod.ZodObject<{
                            font: zod.ZodOptional<zod.ZodObject<{
                                size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                            }, "strip", zod.ZodTypeAny, {
                                size: [number, number];
                            }, {
                                size: [number, number];
                            }>>;
                            justify: zod.ZodOptional<zod.ZodString>;
                            hide: zod.ZodOptional<zod.ZodBoolean>;
                        }, "strip", zod.ZodTypeAny, {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        }, {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        }>>;
                    }, "strip", zod.ZodTypeAny, {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    }, {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    }>;
                    number: zod.ZodObject<{
                        number: zod.ZodString;
                        effects: zod.ZodOptional<zod.ZodObject<{
                            font: zod.ZodOptional<zod.ZodObject<{
                                size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                            }, "strip", zod.ZodTypeAny, {
                                size: [number, number];
                            }, {
                                size: [number, number];
                            }>>;
                            justify: zod.ZodOptional<zod.ZodString>;
                            hide: zod.ZodOptional<zod.ZodBoolean>;
                        }, "strip", zod.ZodTypeAny, {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        }, {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        }>>;
                    }, "strip", zod.ZodTypeAny, {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    }, {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    }>;
                }, "strip", zod.ZodTypeAny, {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }, {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }>, "many">>;
            }, "strip", zod.ZodTypeAny, {
                name: string;
                polylines?: {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }[] | undefined;
                rectangles?: {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }[] | undefined;
                pins?: {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }[] | undefined;
            }, {
                name: string;
                polylines?: {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }[] | undefined;
                rectangles?: {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }[] | undefined;
                pins?: {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }[] | undefined;
            }>, "many">>;
        }, "strip", zod.ZodTypeAny, {
            name: string;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pin_numbers?: {
                hide?: boolean | undefined;
            } | undefined;
            pin_names?: {
                offset: number;
            } | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            symbols?: {
                name: string;
                polylines?: {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }[] | undefined;
                rectangles?: {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }[] | undefined;
                pins?: {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }[] | undefined;
            }[] | undefined;
        }, {
            name: string;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pin_numbers?: {
                hide?: boolean | undefined;
            } | undefined;
            pin_names?: {
                offset: number;
            } | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            symbols?: {
                name: string;
                polylines?: {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }[] | undefined;
                rectangles?: {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }[] | undefined;
                pins?: {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }[] | undefined;
            }[] | undefined;
        }>, "many">;
    }, "strip", zod.ZodTypeAny, {
        symbols: {
            name: string;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pin_numbers?: {
                hide?: boolean | undefined;
            } | undefined;
            pin_names?: {
                offset: number;
            } | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            symbols?: {
                name: string;
                polylines?: {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }[] | undefined;
                rectangles?: {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }[] | undefined;
                pins?: {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }[] | undefined;
            }[] | undefined;
        }[];
    }, {
        symbols: {
            name: string;
            properties?: {
                name: string;
                value: string;
                at?: {
                    x: number;
                    y: number;
                    rotation?: number | undefined;
                } | undefined;
                effects?: {
                    font?: {
                        size: [number, number];
                    } | undefined;
                    hide?: boolean | undefined;
                    justify?: string | undefined;
                } | undefined;
            }[] | undefined;
            pin_numbers?: {
                hide?: boolean | undefined;
            } | undefined;
            pin_names?: {
                offset: number;
            } | undefined;
            exclude_from_sim?: "yes" | "no" | undefined;
            in_bom?: "yes" | "no" | undefined;
            on_board?: "yes" | "no" | undefined;
            symbols?: {
                name: string;
                polylines?: {
                    fill: {
                        type: string;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                    pts: {
                        x: number;
                        y: number;
                    }[];
                }[] | undefined;
                rectangles?: {
                    fill: {
                        type: string;
                    };
                    start: {
                        x: number;
                        y: number;
                    };
                    end: {
                        x: number;
                        y: number;
                    };
                    stroke: {
                        width: number;
                        type?: string | undefined;
                    };
                }[] | undefined;
                pins?: {
                    number: {
                        number: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    type: string;
                    name: {
                        name: string;
                        effects?: {
                            font?: {
                                size: [number, number];
                            } | undefined;
                            hide?: boolean | undefined;
                            justify?: string | undefined;
                        } | undefined;
                    };
                    length: number;
                    at: {
                        x: number;
                        y: number;
                        rotation?: number | undefined;
                    };
                    shape: string;
                }[] | undefined;
            }[] | undefined;
        }[];
    }>;
    SymbolPinSchema: zod.ZodObject<{
        number: zod.ZodString;
        uuid: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
        number: string;
        uuid?: string | undefined;
    }, {
        number: string;
        uuid?: string | undefined;
    }>;
    PathInstanceSchema: zod.ZodObject<{
        path: zod.ZodString;
        reference: zod.ZodString;
        unit: zod.ZodNumber;
    }, "strip", zod.ZodTypeAny, {
        path: string;
        reference: string;
        unit: number;
    }, {
        path: string;
        reference: string;
        unit: number;
    }>;
    ProjectInstanceSchema: zod.ZodObject<{
        name: zod.ZodString;
        path: zod.ZodObject<{
            path: zod.ZodString;
            reference: zod.ZodString;
            unit: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            path: string;
            reference: string;
            unit: number;
        }, {
            path: string;
            reference: string;
            unit: number;
        }>;
    }, "strip", zod.ZodTypeAny, {
        name: string;
        path: {
            path: string;
            reference: string;
            unit: number;
        };
    }, {
        name: string;
        path: {
            path: string;
            reference: string;
            unit: number;
        };
    }>;
    InstancesSchema: zod.ZodObject<{
        project: zod.ZodObject<{
            name: zod.ZodString;
            path: zod.ZodObject<{
                path: zod.ZodString;
                reference: zod.ZodString;
                unit: zod.ZodNumber;
            }, "strip", zod.ZodTypeAny, {
                path: string;
                reference: string;
                unit: number;
            }, {
                path: string;
                reference: string;
                unit: number;
            }>;
        }, "strip", zod.ZodTypeAny, {
            name: string;
            path: {
                path: string;
                reference: string;
                unit: number;
            };
        }, {
            name: string;
            path: {
                path: string;
                reference: string;
                unit: number;
            };
        }>;
    }, "strip", zod.ZodTypeAny, {
        project: {
            name: string;
            path: {
                path: string;
                reference: string;
                unit: number;
            };
        };
    }, {
        project: {
            name: string;
            path: {
                path: string;
                reference: string;
                unit: number;
            };
        };
    }>;
    SymbolInstanceSchema: zod.ZodObject<{
        lib_id: zod.ZodString;
        at: zod.ZodObject<{
            x: zod.ZodNumber;
            y: zod.ZodNumber;
            rotation: zod.ZodOptional<zod.ZodNumber>;
        }, "strip", zod.ZodTypeAny, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }, {
            x: number;
            y: number;
            rotation?: number | undefined;
        }>;
        unit: zod.ZodNumber;
        exclude_from_sim: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        in_bom: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        on_board: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        dnp: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        fields_autoplaced: zod.ZodOptional<zod.ZodEnum<["yes", "no"]>>;
        uuid: zod.ZodOptional<zod.ZodString>;
        properties: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            name: zod.ZodString;
            value: zod.ZodString;
            at: zod.ZodOptional<zod.ZodObject<{
                x: zod.ZodNumber;
                y: zod.ZodNumber;
                rotation: zod.ZodOptional<zod.ZodNumber>;
            }, "strip", zod.ZodTypeAny, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }, {
                x: number;
                y: number;
                rotation?: number | undefined;
            }>>;
            effects: zod.ZodOptional<zod.ZodObject<{
                font: zod.ZodOptional<zod.ZodObject<{
                    size: zod.ZodTuple<[zod.ZodNumber, zod.ZodNumber], null>;
                }, "strip", zod.ZodTypeAny, {
                    size: [number, number];
                }, {
                    size: [number, number];
                }>>;
                justify: zod.ZodOptional<zod.ZodString>;
                hide: zod.ZodOptional<zod.ZodBoolean>;
            }, "strip", zod.ZodTypeAny, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }, {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            }>>;
        }, "strip", zod.ZodTypeAny, {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }, {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }>, "many">>;
        pins: zod.ZodOptional<zod.ZodArray<zod.ZodObject<{
            number: zod.ZodString;
            uuid: zod.ZodOptional<zod.ZodString>;
        }, "strip", zod.ZodTypeAny, {
            number: string;
            uuid?: string | undefined;
        }, {
            number: string;
            uuid?: string | undefined;
        }>, "many">>;
        instances: zod.ZodOptional<zod.ZodObject<{
            project: zod.ZodObject<{
                name: zod.ZodString;
                path: zod.ZodObject<{
                    path: zod.ZodString;
                    reference: zod.ZodString;
                    unit: zod.ZodNumber;
                }, "strip", zod.ZodTypeAny, {
                    path: string;
                    reference: string;
                    unit: number;
                }, {
                    path: string;
                    reference: string;
                    unit: number;
                }>;
            }, "strip", zod.ZodTypeAny, {
                name: string;
                path: {
                    path: string;
                    reference: string;
                    unit: number;
                };
            }, {
                name: string;
                path: {
                    path: string;
                    reference: string;
                    unit: number;
                };
            }>;
        }, "strip", zod.ZodTypeAny, {
            project: {
                name: string;
                path: {
                    path: string;
                    reference: string;
                    unit: number;
                };
            };
        }, {
            project: {
                name: string;
                path: {
                    path: string;
                    reference: string;
                    unit: number;
                };
            };
        }>>;
    }, "strip", zod.ZodTypeAny, {
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        unit: number;
        lib_id: string;
        uuid?: string | undefined;
        properties?: {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }[] | undefined;
        pins?: {
            number: string;
            uuid?: string | undefined;
        }[] | undefined;
        exclude_from_sim?: "yes" | "no" | undefined;
        in_bom?: "yes" | "no" | undefined;
        on_board?: "yes" | "no" | undefined;
        dnp?: "yes" | "no" | undefined;
        fields_autoplaced?: "yes" | "no" | undefined;
        instances?: {
            project: {
                name: string;
                path: {
                    path: string;
                    reference: string;
                    unit: number;
                };
            };
        } | undefined;
    }, {
        at: {
            x: number;
            y: number;
            rotation?: number | undefined;
        };
        unit: number;
        lib_id: string;
        uuid?: string | undefined;
        properties?: {
            name: string;
            value: string;
            at?: {
                x: number;
                y: number;
                rotation?: number | undefined;
            } | undefined;
            effects?: {
                font?: {
                    size: [number, number];
                } | undefined;
                hide?: boolean | undefined;
                justify?: string | undefined;
            } | undefined;
        }[] | undefined;
        pins?: {
            number: string;
            uuid?: string | undefined;
        }[] | undefined;
        exclude_from_sim?: "yes" | "no" | undefined;
        in_bom?: "yes" | "no" | undefined;
        on_board?: "yes" | "no" | undefined;
        dnp?: "yes" | "no" | undefined;
        fields_autoplaced?: "yes" | "no" | undefined;
        instances?: {
            project: {
                name: string;
                path: {
                    path: string;
                    reference: string;
                    unit: number;
                };
            };
        } | undefined;
    }>;
    WireSchema: zod.ZodObject<{
        pts: zod.ZodArray<zod.ZodObject<{
            x: zod.ZodNumber;
            y: zod.ZodNumber;
        }, "strip", zod.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>, "many">;
        stroke: zod.ZodObject<{
            width: zod.ZodNumber;
            type: zod.ZodOptional<zod.ZodString>;
        }, "strip", zod.ZodTypeAny, {
            width: number;
            type?: string | undefined;
        }, {
            width: number;
            type?: string | undefined;
        }>;
        uuid: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
        stroke: {
            width: number;
            type?: string | undefined;
        };
        pts: {
            x: number;
            y: number;
        }[];
        uuid?: string | undefined;
    }, {
        stroke: {
            width: number;
            type?: string | undefined;
        };
        pts: {
            x: number;
            y: number;
        }[];
        uuid?: string | undefined;
    }>;
    SheetPathSchema: zod.ZodObject<{
        path: zod.ZodString;
        page: zod.ZodString;
    }, "strip", zod.ZodTypeAny, {
        path: string;
        page: string;
    }, {
        path: string;
        page: string;
    }>;
    SheetInstancesSchema: zod.ZodObject<{
        path: zod.ZodObject<{
            path: zod.ZodString;
            page: zod.ZodString;
        }, "strip", zod.ZodTypeAny, {
            path: string;
            page: string;
        }, {
            path: string;
            page: string;
        }>;
    }, "strip", zod.ZodTypeAny, {
        path: {
            path: string;
            page: string;
        };
    }, {
        path: {
            path: string;
            page: string;
        };
    }>;
};

export { type At$1 as At, AtSchema, type Board, BoardSchema, type BomField, BomFieldSchema, type BomFormatSettings, BomFormatSettingsSchema, type BomSettings, BomSettingsSchema, type CvPcb, CvPcbSchema, type Defaults, DefaultsSchema, type DesignSettings, DesignSettingsSchema, type Dimensions, DimensionsSchema, type Drawing, DrawingSchema, type Effects$1 as Effects, EffectsSchema, type Erc, ErcSchema, type Font$1 as Font, FontSchema, type Footprint, FootprintSchema, type FpLine, FpLineSchema, type FpText, FpTextSchema, type General, GeneralSchema, type GrLine, type GrRect, GrRectSchema, type Ipc2581, Ipc2581Schema, type KiCadPcb, KiCadPcbSchema, type KicadProject, KicadProjectSchema, KicadSch, type LastPaths, LastPathsSchema, type Layer, LayerSchema, type Libraries, LibrariesSchema, type Meta, MetaSchema, type Model, ModelSchema, type Net, type NetClass, NetClassSchema, type NetReference, NetReferenceSchema, NetSchema, type NetSettings, NetSettingsSchema, type Pad, PadSchema, type Pads, PadsSchema, type PcbNew, PcbNewSchema, type PcbPlotParams, PcbPlotParamsSchema, type Property$1 as Property, PropertySchema, type Rules, RulesSchema, type Schematic, SchematicSchema, type Segment, SegmentSchema, type Setup, SetupSchema, type Stroke$1 as Stroke, StrokeSchema, type TeardropOption, TeardropOptionSchema, type TeardropParameter, TeardropParameterSchema, type TuningPatternDefaults, TuningPatternDefaultsSchema, type TuningPatternSettings, TuningPatternSettingsSchema, type Via, ViaSchema, type ZodAt, type ZodEffects, type ZodFont, type ZodFootprint, type ZodFpLine, type ZodFpText, type ZodGeneral, type ZodGrRect, type ZodKiCadPcb, type ZodLayer, type ZodModel, type ZodNet, type ZodNetReference, type ZodPad, type ZodPcbPlotParams, type ZodProperty, type ZodSegment, type ZodSetup, type ZodStroke, type ZodVia, type Zones, ZonesSchema, convertCircuitJsonToKiCadPcb, convertCircuitJsonToKicadPro, convertKiCadPcbToCircuitJson, convertKiCadPcbToSExprString, mapKicadLayerToTscircuitLayer, mapTscircuitLayerToKicadLayer, parseKiCadPcb, yesnobool };
