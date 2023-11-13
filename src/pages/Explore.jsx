import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { useParams, useSearchParams } from "react-router-dom";
import LatestReleases from "../components/LatestReleases";
import { Context } from "../context/AppContext";

const Explore = () => {
  const { progress, lrl } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get(`type`) || "anime";
  const sort = searchParams.get(`sort`) || "popular";

  return (
    <div className="pt-14">
      <Helmet>
        <title>Latest Episodes - Pahe</title>
      </Helmet>

      <div className=" my-5 bg-white/5"></div>
      <LatestReleases home={false} perPage={24} />
    </div>
  );
};

export default Explore;
