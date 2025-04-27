import {cn} from "@/lib/utils";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useAppDispatch, useAppSelector} from "@/redux/store";
import {setCaptions} from "@/redux/app-slice";
// import SubscribeDialog from "@/components/subscribe-dialog";
import {getMySubscription, verifyStripePayment} from "@/api/payment.api";
import {getUserInfo} from "@/utils/utils";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import PricingDialog from "@/components/pricing-dialog";
import {DeleteIcon, SaveIcon, Trash2Icon} from "lucide-react";


const TranscriptEditor = ({selectedIndex, currentTime}) => {
  const [selected, setSelected] = useState(null);
  const { captions } = useAppSelector((state) => state.app);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);

  const [subscribed, setSubscribed] = useState(false);

  const {isMobile, isTablet, isDesktop} = useScreenDetector()

  useEffect(() => {
    console.log("TranscriptEditor::Captions changed")
  }, [captions]);

  useEffect(() => {
    const currentDate = new Date();
    getMySubscription(getUserInfo().id).then((response) => {
      console.log('getMySubscription', response)
      if (response.data.length > 0 &&
        response.data.some((sub) => new Date(sub.nextBillingDate) > currentDate)
      ) {
        setSubscribed(true);
      }
    })
  }, []);

  useEffect(() => {
    setSelected(selectedIndex);
  }, [selectedIndex]);

  return (
    <div ref={scrollRef}
         className={`flex ${isDesktop ? "p-4 pt-[17px] overflow-y-auto h-[calc(100%-57px)] flex-col gap-4" : 'gap-2'}`}>
      {
        captions ?
        (captions as unknown as any[]).map((item, index) => (
        <TranscriptItemEdit
          caption={item.text}
          start_time={item.start}
          current_time={currentTime}
          end_time={item.end}
          index={index}
          setSelected={setSelected}
          selected={selected}
          key={index+item.text+item.start+item.end}
          initialCaptionsData={captions}
          subscribed={subscribed}
          openSubscribeDialog={() => setOpen(true)}
        />
      )) : <div className='text-white text-center'>Video Not Uploaded Yet</div>}

    <PricingDialog open={open} setOpen={setOpen} returnUrl="caption"/>
      {/* <SubscribeDialog open={open} setOpen={setOpen} /> */}
    </div>
  );
};

const TranscriptItemEdit = ({
  caption,
  start_time,
  end_time,
  current_time,
  index,
  setSelected,
  selected,
  initialCaptionsData,
  subscribed,
  openSubscribeDialog,
}: any) => {
  const [initialCaption, setInitialCaption] = useState(caption);
  const dispatch = useAppDispatch();
  const elementRef = useRef(null);


  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (current_time >= start_time && current_time <= end_time) {
      elementRef.current.scrollIntoView({
        behavior: "smooth", // Enables smooth scrolling
        block: "center", // Scrolls the element into the center of the viewport
      })
    }

  }, [current_time]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 1.0, // Fully visible in the viewport
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      if (selected === index) {
        console.log('focusing on element')
        elementRef.current.focus();
      }
    }
  }, [isInView]);

  useEffect(() => {
    if (selected === index) {
      if (elementRef.current) {
        console.log('scrolling to view')
        elementRef.current.scrollIntoView({
          behavior: "smooth", // Enables smooth scrolling
          block: "center", // Scrolls the element into the center of the viewport
        })

        // Use IntersectionObserver to detect when the element is in view
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              elementRef.current.focus(); // Focus the element when it's visible
              observer.disconnect(); // Stop observing after focusing
            }
          },
          { root: null, threshold: 1.0 } // Ensure it's fully visible
        );

        observer.observe(elementRef.current);
      }
    }
  }, [selected]);

  const saveHandler = () => {
    if (subscribed) {
      const newCaptions = initialCaptionsData.map((item: { alternatives: any[]; }, i: any) => {
        if (i === index) {
          return {
            ...item,
            text: initialCaption,
          };
        } else {
          return item;
        }
      });
      dispatch(setCaptions(newCaptions));
      setSelected(null);
    } else {
      openSubscribeDialog();
    }

  };

  const deleteHandler = () => {
    if (subscribed) {
      const newCaptions = initialCaptionsData.filter((item: { alternatives: any[]; }, i: any) => i !== index);
      dispatch(setCaptions(newCaptions));
      setSelected(null);
    } else {
      openSubscribeDialog();
    }
  };

  return (
    <div
      className={cn(
        "p-2 duration-300 rounded-lg border w-full border-[#3C3B3B] hover:cursor-pointer",
        selected === index && "border-[#E13943]"
      )}
      onFocus={() => {
        setSelected(index);
      }}
      onClick={() => {
        setSelected(index);
      }}
    >
      <input
        ref={elementRef}
        className={cn(
          "text-white text-xl mb-3",
          "bg-[#111111] focus:bg-white outline-none rounded-md w-full pl-1 focus:text-black"
        )}
        value={initialCaption}
        onChange={(e) => setInitialCaption(e.target.value)}
      />
      <div className="w-full flex items-center justify-between">
        <div
          className={cn(
            "duration-300 flex items-center gap-1 bg-[#262525] rounded-lg w-max p-1",
            selected === index && "bg-[#444]"
          )}
        >
          <Image src="/time-circle.png" alt="" width={12} height={12} />
          <div className="flex items-center">
            <p className="text-white text-sm">{start_time}</p>
            <p className="text-white text-sm">-</p>
            <p className="text-white text-sm">{end_time}</p>
          </div>
        </div>
        <AnimatePresence>
          {selected === index && (

            <div className={'flex gap-1'}>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#E13943] hover:bg-[#E13943]/80 text-white h-[28px] text-sm flex items-center justify-center w-[80px] rounded-md"
              onClick={deleteHandler}
            >
              <span className={'flex gap-0.5'}>
                <Trash2Icon size={16}/> Delete
              </span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#E13943] hover:bg-[#E13943]/80 text-white h-[28px] text-sm flex items-center justify-center w-[64px] rounded-md"
              onClick={saveHandler}
            >
              <span className={'flex gap-0.5'}>
                <SaveIcon size={16}/>Save
              </span>
            </motion.button>

            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TranscriptEditor;
