export interface RawData2 {
    result: Result;
}
interface Result {
    nodes: Node[];
    relationships: Relationship[];
}
interface Relationship {
    endNode: string;
    id: string;
    linknum: number;
    multiple_rel?: string;
    old_type?: string;
    source: string;
    startNode: string;
    target: string;
    type: string;
    box?: Box;
    properties?: Properties2;
}
interface Properties2 {
    catalyst_group: string;
    type: string;
    catalyst_sub_group?: string;
}
interface Box {
}
interface Node {
    id: string;
    labels: string[];
    properties: Properties;
}
interface Properties {
    industry_type?: string;
    publisher?: string[];
    sector?: string;
    name: string;
    symbol?: string;
    categori_id?: string;
    redd_catalyst_id?: string;
    redd_main_company?: string;
    status_id?: string;
    uuid?: string;
}
export {};
