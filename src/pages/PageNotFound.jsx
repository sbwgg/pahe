import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center px-2 text-center text-white/[0.8] text-lg">
      <Helmet>
        <title>404 - Pahe</title>
      </Helmet>
      <h1 className="text-2xl sm:text-3xl xl:text-5xl font-bold my-4">
        Oops! Page not found
      </h1>
      <p className="text-base sm:text-lg xl:text-xl text-gray-300 mb-6 text-center">
        The page you're looking for doesn't seem to exist.
      </p>
      <Link to="/">
        <div className="bg-[var(--pink)] text-base xl:text-lg text-white  transition-all duration-200  ease-linear font-medium tracking-wide py-1 px-3 rounded hover:bg-[var(--pinkk)]">
          Go back home
        </div>
      </Link>
    </div>
  );
};
export default PageNotFound;
