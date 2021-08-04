declare module '@ffprobe-installer/ffprobe' {
  declare const FFProbeBinaryInfo: {
    path: string;
    version: string;
    url: string;
  };
  export = FFProbeBinaryInfo;
}
