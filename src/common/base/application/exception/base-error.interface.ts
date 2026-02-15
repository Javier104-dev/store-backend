export interface IBaseErrorInfo {
  status?: number;
  pointer?: string;
  title?: string;
  message?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IBaseErrorInfoParams extends IBaseErrorInfo {}
