import OurServices from "../_components/Services/Services_pages";
import SignUp from "../_components/Main/SignUp";

export default function Main() {

    return (
        <div className="w-full bg-white flex flex-col gap-28 xl:gap-36 mt-[30px]">
            <OurServices />
            <div className="mx-[10px] mb-[100px] mdx:mb-[140px] xl:mb-[180px]">
                <SignUp />
            </div>
        </div>
    );
}
