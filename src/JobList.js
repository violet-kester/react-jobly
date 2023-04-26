import SearchForm from "./SearchForm";
import JobCardList from "./JobCardList";
import JoblyApi from "./api";
import { useState, useEffect } from "react";

/** JobList for information on all jobs
 *
 * Props: N/A
 *
 *
 * State:  {
    - jobs: [
    {
      "id": 1,
      "title": "Conservator, furniture",
      "salary": 110000,
      "equity": "0",
      "companyHandle": "watson-davis",
      "companyName": "Watson-Davis"
    } ... ]
 *
 * JobList -> JobCardList
 */

function JobList() {
  const [jobs, setJobs] = useState({
    data: null,
    isLoading: true,
    errors: null
  });

  /** Show all jobs on initial render */
  useEffect(function getJobsFromAPI() {
    // try {
    async function waitForJobs() {
      const result = await JoblyApi.getJobs();
      setJobs({
        data: result,
        isLoading: false,
        errors: null
      });
    }
    waitForJobs();
    // } catch (error) {
    //   setJobs({
    //     data: null,
    //     isLoading: false,
    //     errors: error
    //   });
    // }}
  }, []);
  console.log(jobs);

  /** Search db for job by title */
  async function handleJobSearch(term) {
    if (term.trim() !== '') {
      const result = await JoblyApi.getJobsByTitle(term);
      console.log(result);
      if (result.length === 0) {
        console.log('I have a length of zero :)');
        setJobs({
          data: null,
          isLoading: true,
          errors: 'Sorry, no results were found'
        });
      };

      setJobs({
        data: result,
        isLoading: false,
        errors: null
      });

    } else {
      const result = await JoblyApi.getJobs();
      setJobs({
        data: result,
        isLoading: false,
        errors: null
      });
    }
  }

  if (jobs.isLoading) {
    return <i>Loading companies...</i>;
  }

  return (
    <div className='JobList'>
      <SearchForm handleSearch={handleJobSearch} message="Search Jobs!" />
      {jobs.errors !== null ? 'Sorry, no results were found' : <JobCardList jobs={jobs.data} />}
    </div>
  );
}

export default JobList;