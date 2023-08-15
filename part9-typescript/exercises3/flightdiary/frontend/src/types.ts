export interface DiaryEntry {
    id: string;
    date: string;
    weather: string;
    visibility: string;
    comment?: string;
  }

  export type DiaryFormValues = Omit<DiaryEntry, "id">;