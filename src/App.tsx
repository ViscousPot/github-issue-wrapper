import { Report } from './pages/Report'
import { Edit } from './pages/Edit'
import { useSearchParams } from 'react-router-dom';
import { Data } from './types';
import * as JSURL from "jsurl2"
import { useEffect } from 'react';

export function App() {
  const [searchParams] = useSearchParams();

  const close = searchParams.get("close");

  if (close) {
    window.open("about:blank", "_self");
    window.close();
  }

  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      console.log("test1")
      const asyncSaveAuth = async () => {
        const response = await fetch(`/access_token/${code}`)

        localStorage.setItem('gitHub_access_token', await response.text());
        window.location.href = "https://github.com/apps/issue-wrapper/installations/new", "_self"
      }

      asyncSaveAuth()
    }
  }, [])

  if (code) {
    return null
  }

  const editData = searchParams.get("e");
  const data = searchParams.get("q");
  if (data == null) return <Edit editData={editData} />

  const json = JSURL.parse<string>(data);
  const parseData: Data = JSON.parse(json);

  if (parseData == undefined) {
    return <Edit editData={editData} />
  }

  return <Report data={parseData} />
}


