import * as RadixSlider from "@radix-ui/react-slider"
import { formatTime } from "@/utils/timeUtils";

interface DurationSliderProps {
  duration?: number;
  currentTime?: number;
  onTimestampChange?: (timestamp: number) => void;
}

const DurationSlider: React.FC<DurationSliderProps> = ({
  duration,
  currentTime,
  onTimestampChange
}) => {
  const handleChange = (newValue: number[]) => {
    onTimestampChange?.(newValue[0]);
  }

  return (
    <>
      <div className="text-neutral-500/80 text-sm">{formatTime(currentTime!)}</div>
      <RadixSlider.Root className="relative flex items-center select-none touch-none md:w-1/2 breakpoint:w-1/2" defaultValue={[currentTime!]} value={[currentTime!]} onValueChange={handleChange} max={duration} step={0.1} aria-label="Timestamp" >
        <RadixSlider.Track
          className="
          bg-gray-500
          relative
          grow
          rounded-lg
          h-[5px]
        "
        >
          <RadixSlider.Range
            className="
            absolute
            bg-white
            rounded-full
            h-full
          "
          />
        </RadixSlider.Track>
      </RadixSlider.Root>
      <div className="text-neutral-500/80 text-sm">{formatTime(duration || 0)}</div>
    </>
  );
};


export default DurationSlider;