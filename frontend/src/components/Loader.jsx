import { Icon } from "@iconify/react";

export default function Loader() {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <Icon icon="svg-spinners:3-dots-move" className="w-12 h-12 text-white" />
        </div>
    );
}
