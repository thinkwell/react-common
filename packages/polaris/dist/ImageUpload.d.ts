type FileProps = (Blob | MediaSource) & {
    name: string;
    url: string;
    size: string;
};
type Props = {
    name: string | string[];
    label: string;
    value?: FileProps;
};
export default function ImageUpload(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
