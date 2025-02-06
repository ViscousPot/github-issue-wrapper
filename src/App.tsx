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
      const asyncSaveAuth = async () => {
        const response = await fetch(`/access_token/${code}`)
        const accessToken = await response.text()
        localStorage.setItem('gitHub_access_token', accessToken);

        const installationResponse = await fetch("https://api.github.com/user/installations", {
          headers: { Authorization: `token ${accessToken}` }
        });

        const installations = await installationResponse.json();

        if (installations.total_count === 0 || !installations.installations.some((installation: { app_id: string }) => installation.app_id == "1123503")) {
          window.location.href = "https://github.com/apps/issue-wrapper/installations/new";
          return;
        }

        window.open("about:blank", "_self");
        window.close();
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


