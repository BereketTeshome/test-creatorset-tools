import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {SetStateAction, useEffect, useState} from "react";
import {fontFamilySettingValues, TextStylingSettings} from "@/components/typings/text-styling-settings";

const CustomLabel = ({ children, className = '' }) => {
  return <Label className={`text-white text-base font-extrabold ${className}`} >{children}</Label>;
}

const HighlightableBoxWithLabel = ({ children, label, width = '140px', isSelected = false, handleClick = () => {} }) => {
  return (
    <div>
      <Label className={`text-gray font-thin text-sm`}>{label}</Label>
      <div
        onClick={() => handleClick()}
        className={`w-[${width}] h-16 bg-neutral-800  ${isSelected ? 'outline-red outline': 'hover:outline-red hover:outline'} flex justify-center items-center`}
           style={{width: width}}
      >
        {children}
      </div>
    </div>
  );
}

interface props {
  textStylingSettings: TextStylingSettings,
  onTextStylingSettingsChange: Function
}

const TextEditor = ({textStylingSettings, onTextStylingSettingsChange}: props) => {

  const [formState, setFormState] = useState(
    textStylingSettings
  );

  useEffect(() => {
    onTextStylingSettingsChange(formState);
  }, [formState]);

  // Function to handle state change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const renderFontSelector = () => {
    return (
      <div className=''>


        <div className='mt-6'>
          <div className="mb-2">
            <CustomLabel>Text Display Style</CustomLabel>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <HighlightableBoxWithLabel label="Normal" isSelected={"normal" === formState.textDisplayStyle}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayStyle',
                                           value: 'normal'
                                         }
                                       })}
            >
              <p
                className="text-white text-xs text-outline font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Welcome
                to my channel</p>
            </HighlightableBoxWithLabel>
            <HighlightableBoxWithLabel label="Full Color" isSelected={"full-color" === formState.textDisplayStyle}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayStyle',
                                           value: 'full-color'
                                         }
                                       })}
            >
              <p
                className="text-blue-700 text-xs text-outline font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Welcome
                to my channel</p>
            </HighlightableBoxWithLabel>
            <HighlightableBoxWithLabel label="One Word Color"
                                       isSelected={"one-word-color" === formState.textDisplayStyle}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayStyle',
                                           value: 'one-word-color'
                                         }
                                       })}
            >
              <p
                className="text-white text-xs text-outline font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                <span className="text-red">Welcome</span>&nbsp;
                to my channel</p>
            </HighlightableBoxWithLabel>
            <HighlightableBoxWithLabel label="Glow" isSelected={"glow" === formState.textDisplayStyle}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayStyle',
                                           value: 'glow'
                                         }
                                       })}
            >
              <p
                className="text-white text-xs text-outline font-extrabold drop-shadow-[0_0.2px_4.2px_rgba(255,255,255,0.8)]">Welcome
                to my channel</p>
            </HighlightableBoxWithLabel>

            <HighlightableBoxWithLabel label="One Word Background"
                                       isSelected={"one-word-background" === formState.textDisplayStyle}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayStyle',
                                           value: 'one-word-background'
                                         }
                                       })}
            >
              <p
                className="text-white text-xs text-outline font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                <span className="bg-purple-600">Welcome</span>&nbsp;
                to my channel</p>
            </HighlightableBoxWithLabel>

            <HighlightableBoxWithLabel label="Word Background"
                                       isSelected={"word-background" === formState.textDisplayStyle}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayStyle',
                                           value: 'word-background'
                                         }
                                       })}
            >
              <p
                className="text-white bg-rose-600 text-xs text-outline font-extrabold">Welcome
                to my channel</p>
            </HighlightableBoxWithLabel>
          </div>

        </div>

        <div className='mt-6'>
          <div className="mb-2">
            <CustomLabel>Text Display Format</CustomLabel>
          </div>


          <div className="flex items-center gap-3 flex-wrap">
            <HighlightableBoxWithLabel label="One World Line" isSelected={"one-line" === formState.textDisplayFormat}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayFormat',
                                           value: 'one-line'
                                         }
                                       })}
            >
              <div className='bg-amber-50 w-[106px] h-[9px] rounded-[2px]'></div>
            </HighlightableBoxWithLabel>

            <HighlightableBoxWithLabel label="Two World Lines" isSelected={"two-lines" === formState.textDisplayFormat}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayFormat',
                                           value: 'two-lines'
                                         }
                                       })}
            >
              <div className='flex flex-col justify-center items-center gap-1 h-32'>
                <div className='bg-amber-50 w-[106px] h-[9px] rounded-[2px]'></div>
                <div className='bg-amber-50 w-[74px] h-[9px] rounded-[2px]'></div>
              </div>
            </HighlightableBoxWithLabel>

            <HighlightableBoxWithLabel label="Single Word" isSelected={"single-word" === formState.textDisplayFormat}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayFormat',
                                           value: 'single-word'
                                         }
                                       })}
            >
              <div className='bg-amber-50 w-[34px] h-[9px] rounded-[2px]'></div>
            </HighlightableBoxWithLabel>

          </div>


        </div>


        <div className='mt-6'>
          <div className="mb-2">
            <CustomLabel>Text Display Position</CustomLabel>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <HighlightableBoxWithLabel label="Top" width='85px' isSelected={"top" === formState.textDisplayPosition}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayPosition',
                                           value: 'top'
                                         }
                                       })}
            >
              <div className='h-full'>
                <div className='mt-2 bg-amber-50 w-[70px] h-[9px] rounded-[2px]'></div>
              </div>
            </HighlightableBoxWithLabel>

            <HighlightableBoxWithLabel label="Center" width='85px'
                                       isSelected={"center" === formState.textDisplayPosition}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayPosition',
                                           value: 'center'
                                         }
                                       })}
            >
              <div className='bg-amber-50 w-[70px] h-[9px] rounded-[2px]'></div>
            </HighlightableBoxWithLabel>

            <HighlightableBoxWithLabel label="Bottom" width='85px'
                                       isSelected={"bottom" === formState.textDisplayPosition}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'textDisplayPosition',
                                           value: 'bottom'
                                         }
                                       })}
            >
              <div className='h-full flex content-end flex-wrap'>
                <div className='bg-amber-50 w-[70px] h-[9px] rounded-[2px] mb-2'></div>
              </div>
            </HighlightableBoxWithLabel>
          </div>


        </div>

        <div className='mt-6'>
          <div className="mb-2">
            <CustomLabel>Font & Size</CustomLabel>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <CustomLabel>Font</CustomLabel>
              <Select onValueChange={(value) => {
                handleChange({target: {name: 'fontFamily', value: value}})
              }}>
                <SelectTrigger className="w-[150px] border-[#4B4B4B] border bg-[#313030] text-white">
                  <SelectValue className="font-bold" placeholder={formState.fontFamily}/>
                </SelectTrigger>
                <SelectContent className="w-[176px] border-[#4B4B4B] border bg-[#313030] text-white">
                  {textStylingSettings.fontFamily}
                  {fontFamilySettingValues.map((fontFamily) => (
                    <SelectItem value={fontFamily}>{fontFamily}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <CustomLabel>Size</CustomLabel>
              <Select onValueChange={(value) => {
                handleChange({target: {name: 'fontSize', value: value}})
              }}>
                <SelectTrigger className="w-[124px] border-[#4B4B4B] border bg-[#313030] text-white">
                  <SelectValue className="font-bold" placeholder={formState.fontSize}/>
                </SelectTrigger>
                <SelectContent className="w-[100px] border-[#4B4B4B] border bg-[#313030] text-white">
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>


        <div className='mt-6'>
          <div className="mb-2">
            <CustomLabel>Animation</CustomLabel>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <HighlightableBoxWithLabel label="Bottom" width='85px'
                                       isSelected={"none" === formState.animations}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'animations',
                                           value: 'none'
                                         }
                                       })}
            >
              None
            </HighlightableBoxWithLabel>

            <HighlightableBoxWithLabel label="Bottom" width='85px'
                                       isSelected={"bounce" === formState.animations}
                                       handleClick={() => handleChange({
                                         target: {
                                           name: 'animations',
                                           value: 'bounce'
                                         }
                                       })}
            >
              Bounce
            </HighlightableBoxWithLabel>
          </div>
        </div>

        <div className="h-[150px]">

        </div>

      </div>
    );
  };
  return <div className="p-4">{renderFontSelector()}</div>;
};

export default TextEditor;
