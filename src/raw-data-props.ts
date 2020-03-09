export interface RawData {
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
  datetime?: string;
  properties?: Properties2;
  updated_at?: string;
}

interface Properties2 {
  category: string;
  publish_date: string;
  source_url: string;
  topic: string;
}

interface Box {
}

export interface Node {
  id: string;
  labels: string[];
  properties: Properties;
}

interface Properties {
  categori_id?: string;
  event_title?: string;
  redd_catalyst_id?: string;
  redd_main_company?: string;
  status_id?: string;
  uuid?: string;
  full_name?: string;
  industry_type?: string;
  publisher?: string[];
  sector?: string;
  symbol?: string;
}