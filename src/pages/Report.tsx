import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { Data } from "../types";
import { CLIENT_ID, REDIRECT_URI } from "../constants";


type Props = {
    data: Data
}

export const Report = ({ data }: Props) => {
    const [authToken, setAuthToken] = useState("")
    const [title, setTitle] = useState("")
    const [answers, setAnswers] = useState<string[]>([])
    const [searchParams] = useSearchParams();
    const [errorOccurred, setErrorOccurred] = useState(false);

    const onFocus = async () => {
        const token = localStorage.getItem('gitHub_access_token') ?? ""
        setAuthToken(token)
        if (!token) return

        try {
            const response = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Invalid token");
            }
        } catch (error) {
            localStorage.removeItem("gitHub_access_token");
            setAuthToken("");
        }
    };

    useEffect(() => {
        window.addEventListener("focus", onFocus);
        onFocus();
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    return (
        <div
            className="flex h-screen w-screen flex-col items-center justify-start gap-8 overflow-y-scroll px-6 py-8 sm:px-8 sm:py-32"
        >
            {
                data?.appIconUrl
                    ? <img
                        id="previewImage"
                        className="border-1/4 mb-2 block w-32 rounded-lg p-1"
                        alt="Selected Preview"
                        src={data?.appIconUrl}
                    />
                    : null
            }
            <p className="dark:text-white mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Report an issue with {data?.appName}</p>

            {authToken
                ? <>
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="iconSelect" className="text-md dark:text-white mb-2 block font-medium text-gray-900">
                            Please provide a short description of the issue you are facing.
                        </label>
                        <input
                            id="iconUrl"
                            onChange={(event) => {
                                setTitle(event.target.value)
                                setErrorOccurred(false)
                            }}
                            placeholder="..."
                            className="dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className={`${title ? "opacity-100" : "opacity-0"} w-full sm:w-1/2 transition-all flex flex-col gap-6`}>
                        {data?.questions.map((question, index) =>
                            <div className="w-full">
                                <label htmlFor="iconSelect" className="dark:text-white mb-2 block text-sm font-medium text-gray-900">
                                    {question}
                                </label>
                                <textarea
                                    id="iconUrl"
                                    onChange={(event) => {
                                        setAnswers((prev) => {
                                            prev[index] = event.target.value
                                            return prev
                                        })
                                        setErrorOccurred(false)
                                    }}
                                    placeholder="..."
                                    className="dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        )}
                        {errorOccurred ? <p className="font-bold text-rose-300">Please make sure you have filled out all provided fields.</p> : null}
                        <button
                            className="dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800 mb-8 me-2 mt-4 rounded-lg bg-rose-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
                            onClick={async () => {
                                const logs = searchParams.get("logs") ?? ""
                                if (title == "" || answers.length != data?.questions.length || answers.some((answer) => answer === "")) {
                                    setErrorOccurred(true)
                                    return
                                }

                                const response = await fetch(`https://api.github.com/repos/${data.repoPath}/issues`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${authToken}`,
                                        'Accept': 'application/vnd.github+json',
                                    },
                                    body: JSON.stringify({
                                        title,
                                        body: `
${data.questions.map((question, index) => `
#### ${question}
${answers[index]}

`.trim()).join("\n\n")}

---

${logs}
                                        `.trim(),
                                    }),
                                });

                                if (response.status == 401) {
                                    localStorage.removeItem('gitHub_access_token')
                                    setAuthToken("")
                                    return
                                }

                                window.open("about:blank", "_self");
                                window.close();
                            }}>
                            REPORT
                        </button>
                    </div>
                </>
                : <>
                    <p className="text-1xl dark:text-white mt-4 text-center font-bold sm:text-2xl">To get started, please sign in with your GitHub account to authorize issue reporting.</p>
                    <button
                        className="dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mb-2 me-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                        onClick={() => window.open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`, "_blank")}>
                        OAUTH
                    </button>
                </>
            }
        </div>
    )
}
