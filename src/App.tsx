import { Report } from './pages/Report'
import { Edit } from './pages/Edit'
import { useSearchParams } from 'react-router-dom';
import { Data } from './types';
import * as JSURL from "jsurl2"

export function App() {
  const [searchParams] = useSearchParams();

  const close = searchParams.get("close");

  if (close != null) {
    window.open("about:blank", "_self");
    window.close();
  }

  const code = searchParams.get("code");

  if (code != null) {
    const asyncSaveAuth = async () => {
      const response = await fetch(`access_token/${code}`)
      //   method: 'POST',
      //   headers: {
      //     'Accept': 'application/json',
      //   },
      //   body: new URLSearchParams({
      //     client_id: CLIENT_ID,
      //     client_secret: import.meta.env.VITE_CLIENT_SECRET,
      //     code,
      //     redirect_uri: REDIRECT_URI,
      //   }),
      // });


      // const data = await response.json();

      console.log(response)
      console.log(response.json())
      // localStorage.setItem('gitHub_access_token', data.access_token);
      // window.location.href = "https://github.com/apps/issue-wrapper/installations/new", "_self"
    }

    asyncSaveAuth()

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


