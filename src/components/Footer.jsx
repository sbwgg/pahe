import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

function Footer() {
  const { pathname } = useLocation();
  if (pathname === "/auth/login" || pathname === "/auth/register") return null;
  return (
    <section className="text-[#dbdcdd] z-40 mt-[20vh] bg-[#0c0d10] lg:flex lg:h-[12rem] lg:items-center  lg:justify-between">
      <div className="mx-auto flex w-[90%] lg:w-[95%] xl:w-[80%] flex-col space-y-10 pb-6 pt-3 lg:pt-0 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:py-0">
        <div className="flex items-center gap-24">
          <div className="lg:flex grid items-center lg:gap-10 gap-2 md:gap-3">
            {/* <h1 className="font-outfit text-[2.56rem]">choopa</h1> */}
            <Link
              to="/"
              className="logo flex-shrink-0 font-bold text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              <img src={logo} alt="" />
            </Link>
            <div>
              <p className="flex items-center gap-1 font-karla lg:text-[0.81rem] text-[0.7rem] text-[#CCCCCC]">
                &copy; {new Date().getFullYear() || "2023"} pahe | Website Made
                by HY69
              </p>
              <p className="font-karla lg:text-[0.8rem] text-[0.65rem] text-[#9c9c9c]  lg:w-[520px] italic">
                This site does not store any files on our server, we only linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
          </div>
          {/* <div className="lg:hidden lg:block">
            <Image
              src="https://i1210.photobucket.com/albums/cc417/kusanagiblog/NarutoVSSasuke.gif"
              alt="gambar"
              title="request nya rapip yulistian"
              width={210}
              height={85}
            />
          </div> */}
        </div>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-[9.06rem] text-[#a7a7a7] text-sm lg:text-end">
          <div className="flex flex-col gap-10 font-karla  font-bold lg:flex-row lg:gap-[5.94rem]">
            <ul className="flex flex-col gap-y-[0.7rem] ">
              <li className="cursor-pointer hover:text-action hover:text-white">
                <Link to={`/anime`}>This Season</Link>
              </li>
              <li className="cursor-pointer hover:text-white">
                <Link to="/">Popular Anime</Link>
              </li>
              <li className="cursor-pointer hover:text-white">
                <Link to="/latest-episodes">Latest Episodes</Link>
              </li>
              {/* <li className="cursor-pointer hover:text-white">
                <Link target={`_blank`} to="https://ko-fi.com/zeusss">
                  Donate
                </Link>
              </li> */}
              {/* gibe me money */}
              <li className="cursor-pointer hover:text-white">
                <Link target={`_blank`} to="https://github.com/zeusssssssssss/pahe">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
