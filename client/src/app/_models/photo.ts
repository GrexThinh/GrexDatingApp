export interface Photo {
  id: number;
  url: string;
  isMain: boolean;
}

export interface GroupPhoto {
  file: File;
  isMainImage: boolean;
}
