export interface PostModel {
    id?: string | null,
    title?: string;
    content?: string;
    createdOn?: Date;
    imagePath?: string;
    creator?: string
}