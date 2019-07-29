import { BaseType, Selection } from 'd3-selection';

type Orientation = 'vertical' | 'horizontal';
type Alignment = 'start' | 'middle' | 'end';
type Shape = 'rect' | 'circle' | 'line' | 'path';
type EventType = 'cellover' | 'cellout' | 'cellclick';

export interface LegendColor {
    scale(scale: (any)): (selection: Selection<BaseType, any, any, any>, ...args: any[]) => void;
    cells(steps: number): LegendColor;
    cells(steps: number[]): LegendColor;
    cellFilter(filter: () => boolean): LegendColor;
    orient(orientation: Orientation): LegendColor;
    ascending(ascending: boolean): LegendColor;
    shape(shape: Shape, path?: string): LegendColor;
    shapeWidth(width: number): LegendColor;
    shapeHeight(height: number): LegendColor;
    shapeRadius(radius: number): LegendColor;
    shapePadding(padding: number): LegendColor;
    useClass(useClass: boolean): LegendColor;
    classPrefix(prefix: string): LegendColor;
    title(title: string): LegendColor;
    titleWidth(width: number): LegendColor;
    labels(labels: string[]): LegendColor;
    labels(labelGenerator: Function): LegendColor;
    labelAlign(alignment: Alignment): LegendColor;
    labelFormat(format: (n: number) => string): LegendColor;
    labelOffset(offset: number): LegendColor;
    labelDelimiter(delimiter: string): LegendColor;
    on(eventType: EventType, event: Function): LegendColor;
}

export interface LegendSize {
    scale(scale: (any)): (selection: Selection<BaseType, any, any, any>, ...args: any[]) => void;
    cells(steps: number): LegendColor;
    cells(steps: number[]): LegendColor;
    cellFilter(filter: () => boolean): LegendColor;
    orient(orientation: Orientation): LegendColor;
    ascending(ascending: boolean): LegendColor;
    shape(shape: Shape, path?: string): LegendColor;
    shapeWidth(width: number): LegendColor;
    shapePadding(padding: number): LegendColor;
    classPrefix(prefix: string): LegendColor;
    title(title: string): LegendColor;
    titleWidth(width: number): LegendColor;
    labels(labels: string[]): LegendColor;
    labels(labelGenerator: Function): LegendColor;
    labelAlign(alignment: Alignment): LegendColor;
    labelFormat(format: (n: number) => string): LegendColor;
    labelOffset(offset: number): LegendColor;
    labelDelimiter(delimiter: string): LegendColor;
    on(eventType: EventType, event: Function): LegendColor;
}

export interface LegendSymbol {
    scale(scale: (any)): (selection: Selection<BaseType, any, any, any>, ...args: any[]) => void;
    cells(steps: number): LegendColor;
    cells(steps: number[]): LegendColor;
    cellFilter(filter: () => boolean): LegendColor;
    orient(orientation: Orientation): LegendColor;
    ascending(ascending: boolean): LegendColor;
    shapePadding(padding: number): LegendColor;
    classPrefix(prefix: string): LegendColor;
    title(title: string): LegendColor;
    titleWidth(width: number): LegendColor;
    labels(labels: string[]): LegendColor;
    labels(labelGenerator: Function): LegendColor;
    labelAlign(alignment: Alignment): LegendColor;
    labelFormat(format: (n: number) => string): LegendColor;
    labelOffset(offset: number): LegendColor;
    labelDelimiter(delimiter: string): LegendColor;
    on(eventType: EventType, event: Function): LegendColor;
}

export function legendColor(...args: any[]): LegendColor;

export function legendSize(...args: any[]): LegendSize;

export function legendSymbol(...args: any[]): LegendSymbol;

export namespace legendHelpers {
    function thresholdLabels(_ref: any): any;

}
