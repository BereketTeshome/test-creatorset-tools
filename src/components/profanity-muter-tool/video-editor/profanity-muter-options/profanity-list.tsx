import {cn} from "@/lib/utils";
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useAppDispatch, useAppSelector} from "@/redux/store";
import {setCaptions, setProfanityWhitelist } from "@/redux/app-slice";
import SubscribeDialog from "@/components/subscribe-dialog";
import {getMySubscription} from "@/api/payment.api";
import {getUserInfo} from "@/utils/utils";
import {useScreenDetector} from "@/components/ui/use-screen-detector";
import {formatTime} from "@/utils/timeFunctions";
import {ClockIcon, ListCheckIcon, ListIcon, VolumeIcon, VolumeXIcon} from "lucide-react";


const ProfanityList = ({selectedIndex, currentTime}) => {
  const [selected, setSelected] = useState(null);
  const { captions, profanityWhitelist } = useAppSelector((state) => state.app);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);

  const [subscribed, setSubscribed] = useState(false);

  const {isMobile, isTablet, isDesktop} = useScreenDetector()

  const [profanityItems, setProfanityItems] = useState([]);

  useEffect(() => {
    setProfanityItems(captions ? captions.map((x, index) => ({...x, originalIndex: index})).filter((item) => !!item.profanity).map(x => ({...x, muted: x.muted ?? true, whitelisted: profanityWhitelist.includes(x.text)})): []);
  }, [captions, profanityWhitelist]);


  useEffect(() => {
    if (getUserInfo().id) {
      const currentDate = new Date();
      getMySubscription(getUserInfo().id).then((response) => {
        console.log('getMySubscription', response)
        if (response.data.length > 0 && 
          response.data.some((sub) => new Date(sub.nextBillingDate) > currentDate)
        ) {
          setSubscribed(true);
        }
      })
    } else {
      setSubscribed(false);
    }
  }, []);

  useEffect(() => {
    setSelected(selectedIndex);
  }, [selectedIndex]);

  return (
    <div ref={scrollRef}
         className={`flex ${isDesktop ? "p-4 pt-[17px] overflow-y-auto flex-col gap-4" : 'gap-2'}`}>
      {
         profanityItems && profanityItems.length > 0 &&
        (profanityItems as unknown as any[]).map((item, index) => (
        <ProfanityItemsEdit
          caption={item.text}
          start_time={item.start}
          current_time={currentTime}
          end_time={item.end}
          index={item.originalIndex}
          muted={item.muted}
          whitelisted={item.whitelisted}
          setSelected={setSelected}
          selected={selected}
          key={index}
          initialCaptionsData={captions}
          subscribed={subscribed}
          openSubscribeDialog={() => setOpen(true)}
        />))
      }
      {
        profanityItems && profanityItems.length == 0 &&
          <div className="text-center">
              <div className="flex justify-center">
                  <Image src="/placeholder/Food.svg" alt={""} width={200} height={200}/>
              </div>
              <div className="text-gray">No Profanity found.</div>
          </div>
      }
      {
        !profanityItems &&
          <div className='text-white text-center'>Video Not Uploaded Yet</div>
      }


      {/*<SubscribeDialog open={open} setOpen={setOpen}/>*/}
    </div>
  );
};

const ProfanityItemsEdit = ({
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
  muted,
  whitelisted,
  onMutedChange,
}: any) => {
  const [initialCaption, setInitialCaption] = useState(caption);
  const dispatch = useAppDispatch();
  const elementRef = useRef(null);


  const { profanityWhitelist, captions } = useAppSelector((state) => state.app);
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

  const unmuteHandler = () => {
    const newCaptions = initialCaptionsData.map((item: { alternatives: any[]; }, i: any) => {
      if (i === index) {
        return {
          ...item,
          muted: !muted,
        };
      } else {
        return item;
      }
    });
    dispatch(setCaptions(newCaptions));
    setSelected(null);
  };

  const whitelistHandler = () => {
    let newProfanityWhitelist = [...profanityWhitelist];
    if (!whitelisted) {
      newProfanityWhitelist.push(caption);
    } else {
      newProfanityWhitelist = newProfanityWhitelist.filter((item) => item !== caption);
    }

    dispatch(setProfanityWhitelist(newProfanityWhitelist));

    const newCaptions = captions.map((item: { alternatives: any[]; text: string}, i: any) => {
      return {
        ...item,
        whitelisted: newProfanityWhitelist.includes(item.text)
      };
    });
    dispatch(setCaptions(newCaptions));
    setSelected(null);
  }

  return (
    <div
      className={cn(
        "p-2 duration-300 rounded-lg border w-full border-[#3C3B3B]",
        selected === index && "border-[#E13943]",
        whitelisted && "bg-[#3C3B3B]/50",
      )}
      onFocus={() => {
        console.info("focused !!!");
        setSelected(index);
      }}
    >
      <div className="flex gap-2 mb-3">
        <div
          className={cn(
            "duration-300 flex items-center gap-1 bg-gray3 rounded-lg px-3 text-gray  justify-center items-center"
          )}
        >
          <ClockIcon className="" size={15}/>
          <div className="flex items-center">
            <p className=" text-sm">{formatTime(start_time)}</p>
            <p className=" text-sm">-</p>
            <p className=" text-sm">{formatTime(end_time)}</p>
          </div>
        </div>
        <input
          ref={elementRef}
          className={cn(
            "text-white text-xl",
            "bg-[#111111] focus:bg-white outline-none rounded-md w-full pl-1 focus:text-black"
          )}
          disabled
          value={initialCaption}
          onChange={(e) => setInitialCaption(e.target.value)}
        />
      </div>
      <div className="w-full flex items-center justify-end gap-3">
        {
          !whitelisted &&
            <button
                className="bg-[#E13943] hover:bg-[#E13943]/80 text-white h-[28px] text-sm flex items-center justify-center rounded-md px-3"
                onClick={unmuteHandler}
            >
              {muted ?  <VolumeXIcon className="mr-2" size={15}/> : <VolumeIcon className="mr-2" size={15} />}
              {muted ? "Unmute" : "Mute"}
            </button>
        }

        <button
          className="bg-[#E13943] hover:bg-[#E13943]/80 text-white h-[28px] text-sm flex items-center justify-center rounded-md px-3"
          onClick={whitelistHandler}
        >
          <ListCheckIcon size={15} className="mr-2"/>
          {whitelisted ? "Remove from Whitelist" : "Add to Whitelist"}
        </button>
      </div>

    </div>
  );
};

export default ProfanityList;
