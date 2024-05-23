import type { ValidSize } from "@/interfaces";
import clsx from "clsx";

interface Props {
  selectedSize?: ValidSize;
  availableSizes: ValidSize[];
  onSizeChange: (size: ValidSize) => void;
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChange,
}: Props) => {
  return (
    <div className="my-5">
      <h3 className="mb-4 font-bold">Available sizes</h3>

      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={clsx("mx-2 hover:underline text-lg", {
              underline: size === selectedSize,
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
