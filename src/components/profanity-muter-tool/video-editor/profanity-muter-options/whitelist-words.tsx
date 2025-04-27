import {useAppDispatch, useAppSelector} from "@/redux/store";
import {Trash2Icon} from "lucide-react";
import {setProfanityWhitelist} from "@/redux/app-slice";
import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";

interface props {
}

const WhitelistWordItem = ({key, text, onDeleteClicked}) => {
  return <div className="text-white text-sm rounded-2xl border-gray border-2 p-4 flex justify-between" key={key}>
    {/* Add your item rendering logic here */}
    {text}
    <Trash2Icon className={'text-red hover:cursor-pointer'} onClick={onDeleteClicked}/>
  </div>;
}

const WhitelistWords = ({}: props) => {


  const [ newText, setNewText ] = useState<string>('')
  const dispatch = useAppDispatch()
  const { profanityWhitelist } = useAppSelector((state) => state.app);

  const handleRemoveFromWhitelist = (text: string) => {
    const newProfanityWhitelist = profanityWhitelist.filter((item) => item !== text);
    dispatch(setProfanityWhitelist(newProfanityWhitelist));
    console.log('newProfanityWhitelist', newProfanityWhitelist);

  }

  const handleAddToWhitelist = (text: string) => {
    if (text.trim() === '') return;
    if (profanityWhitelist.includes(text)) return;
    const newProfanityWhitelist = [...profanityWhitelist, text];
    dispatch(setProfanityWhitelist(newProfanityWhitelist));
    setNewText('')
    console.log('newProfanityWhitelist', newProfanityWhitelist);
  }

  const onNewItemChange = (e) => {
    setNewText(e.target.value)
  }

  return <div className="p-4">
    <div className="text-white">
      <h2 className="text-[18px] font-semibold">Whitelist Words</h2>
      <p className="text-gray text-sm mt-2">Words that you want to whitelist.</p>
    </div>
    <AnimatePresence>
      <motion.div className="mt-4">
        { profanityWhitelist.map((item, index) => (
          <motion.div className="mt-1"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      key={index+item}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <WhitelistWordItem key={index+item} text={item} onDeleteClicked={() => handleRemoveFromWhitelist(item)}/>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
    <div className="mt-4">
      <p className="text-gray text-sm">Add words to the whitelist.</p>
      <input type="text" onChange={onNewItemChange} placeholder="Add a word" className="mt-2 p-2 rounded-md border border-gray w-full"/>
      <button className="mt-2 bg-red text-white rounded-md p-2"
      onClick={() => handleAddToWhitelist(newText)}
      >Add to Whitelist</button>
    </div>
  </div>;
};

export default WhitelistWords;
