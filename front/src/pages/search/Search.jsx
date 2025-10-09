import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import axios from "axios";
import "./search.css";
import SearchCard from "../../components/searchCard/SearchCard";

export default function Search() {
  const [fetching, setFetching] = useState(true);
  const { search } = useLocation();
  const { query } = qs.parse(search);
  const [results, setResults] = useState([]);
  useEffect(() => {
    console.log(
      `we are in useeffect and searchis ${search},query is ${query} `,
    );
    const fetchResults = async () => {
      setFetching(true);
      const res = await axios.get("/product/search?querystring=" + query);
      setResults(res.data);
      console.log(results);
      setFetching(false);
    };
    fetchResults();
  }, [search]);
  console.log("result is " + results.length + "long");

  // const ad = "fshd";
  return (
    <>
      <div>
        {fetching == true ? (
          <div className="container mr-3 justify-content-center align-middle">
            <div className="row text-center justify-content-center align-middle">
              <div className="col-xl-10 loading-text">Loading . . .</div>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center text-white fs-3 ">
            <div className="col-xs-5 text-center result-number">
              we got {results.length} results.
            </div>
          </div>
        )}
      </div>

      <div className="container">
        <div className="row justify-content-center">
          {results.map((result) => (
            <div className="col-xl-10 search-result row justify-content-start">
              <SearchCard key={result._id} result={result} />
            </div>
          ))}
        </div>
      </div>

      {/*<SearchCard     />*/}
    </>
  );
}

// <div className='container pl-5 mx-auto'>
//  <div className="row">
//    {results.length == 0 ?
//      <div className="col-xl-10 loading-text">
//        No results for {query}
//      </div>
//      :
//      // <p>we got resultts {results.length}</p>
//      <div className='row col-xl-10'>

//      {results.map((result)=>{
//                      <SearchCard key={result._id} result={result} />
//                    })}
//      </div>
//    }
//  </div>
// </div>
