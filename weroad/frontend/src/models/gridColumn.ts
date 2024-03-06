export declare type GridColumn = {
  name: string;
  key: string;
  value?: string;
  type: string;
  href: string;
  subjectTo?: {
    field: string;
    value: boolean;
    tooltip?: string;
  };
};
