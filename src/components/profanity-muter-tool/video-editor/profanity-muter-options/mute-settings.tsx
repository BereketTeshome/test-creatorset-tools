import * as Slider from "@radix-ui/react-slider";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface props {
  bleepMethod: string,
  setBleepMethod: (value: string) => void,
  wordRetention: number,
  setWordRetention: (value: number) => void
}

const MuteSettings = ({bleepMethod, setBleepMethod, wordRetention, setWordRetention}: props) => {
  return <div className="p-4 text-white">
    <div>
      <div>Word Retention</div>
      <div className="flex items-center justify-between">
        <div>
          <Slider.Root
            className="relative flex h-5 w-[200px] touch-none select-none items-center"
            defaultValue={[0]}
            max={100}
            step={5}
            onValueChange={(value) => setWordRetention(value[0])}
          >
            <Slider.Track className="relative h-[10px] grow rounded-full bg-gray4">
              <Slider.Range className="absolute h-full rounded-full bg-red" />
            </Slider.Track>
            <Slider.Thumb
              className="block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
              aria-label="Volume"
            />
          </Slider.Root>
        </div>
        <div>
          {wordRetention}%
        </div>
      </div>
    </div>
    <div className="mt-3">
      <div className="my-1">Bleep Method</div>
      <div className="w-full">
        <Select
          value={bleepMethod}
          onValueChange={(value) => {
          setBleepMethod(value)
        }}>
          <SelectTrigger className="w-full border-[#4B4B4B] border bg-[#313030] text-white">
            <SelectValue className="font-bold" placeholder="Select Bleep Method"/>
          </SelectTrigger>
          <SelectContent className="w-full border-[#4B4B4B] border bg-[#313030] text-white">
            <SelectItem value="muted">Silence</SelectItem>
            <SelectItem value="beep">Beep</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>;
};

export default MuteSettings;
