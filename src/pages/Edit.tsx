import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Data } from "../types";
import * as JSURL from "jsurl2"

type Props = {
    editData: string | null;
}

export const Edit = ({ editData }: Props) => {
    const [appIconUrl, setAppIconUrl] = useState("");
    const appNameRef = useRef<HTMLInputElement>(null);
    const repoPathRef = useRef<HTMLInputElement>(null);
    const [questions, setQuestions] = useState<string[]>([]);

    useEffect(() => {
        if (editData == null) {
            setAppIconUrl("")
            if (appNameRef.current) appNameRef.current.value = ""
            if (repoPathRef.current) repoPathRef.current.value = ""
            setQuestions([])

            return
        }

        const json = JSURL.parse<string>(editData);
        const parseData: Data = JSON.parse(json);

        setAppIconUrl(parseData?.appIconUrl ?? "")
        if (appNameRef.current) appNameRef.current.value = parseData?.appName ?? ""
        if (repoPathRef.current) repoPathRef.current.value = parseData?.repoPath ?? ""
        setQuestions(parseData?.questions ?? [])
    }, [editData])

    const [errorOccurred, setErrorOccurred] = useState(false);
    const navigate = useNavigate()

    return (
        <div
            className="flex h-screen w-screen flex-col items-center justify-start gap-8 overflow-y-scroll px-6 py-8 sm:px-8 sm:py-32"
        >
            <h1 className="dark:text-white mb-8 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Issue Wrapper</h1>
            {
                (appIconUrl !== "")
                    ? <img
                        id="previewImage"
                        className="border-1/4 mb-2 block w-32 rounded-lg bg-zinc-50 p-1"
                        alt="Selected Preview"
                        src={appIconUrl}
                    />
                    : null
            }
            <div className="w-full sm:w-1/2">
                <label htmlFor="iconSelect" className="dark:text-white mb-2 block text-sm font-medium text-gray-900">
                    Application Icon URL (optional)
                </label>
                <input
                    id="iconUrl"
                    onChange={(event) => {
                        setErrorOccurred(false)
                        setAppIconUrl(event?.target.value)
                    }}
                    defaultValue={appIconUrl}
                    placeholder="https://raw.githubusercontent.com/username/repository/master/icon.png"
                    className="dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="w-full sm:w-1/2">
                <label htmlFor="appName" className="dark:text-white mb-2 block text-sm font-medium text-gray-900">
                    Application Name
                </label>
                <input
                    id="appName"
                    onChange={() => setErrorOccurred(false)}
                    ref={appNameRef}
                    placeholder="GitHubIssueWrapper"
                    className="dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="w-full sm:w-1/2">
                <label htmlFor="url" className="dark:text-white mb-2 block text-sm font-medium text-gray-900">
                    GitHub Repository
                </label>
                <input
                    id="url"
                    ref={repoPathRef}
                    onChange={() => setErrorOccurred(false)}
                    placeholder="username/repository"
                    className="dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="w-full sm:w-1/2">
                <label htmlFor="url" className="dark:text-white mb-2 block text-sm font-medium text-gray-900">
                    Questions (optional)
                </label>
                <button
                    onClick={() => setQuestions((prev) => prev.concat([""]))}
                    className="dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mb-4 w-full rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                >+ Add</button>
                {questions.map((question, index) => (
                    <div
                        key={`${index}+${question}`}
                        className="mb-2 flex gap-2"
                    >
                        <input
                            id="url"
                            defaultValue={question}
                            onChange={(event) => {
                                setErrorOccurred(false)
                                setQuestions((prev) => {
                                    prev[index] = event.target.value;
                                    return prev;
                                })
                            }}
                            placeholder="What happened?"
                            className="dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => setQuestions((prev) => prev.slice(0, index).concat(index < prev.length - 1 ? prev[index + 1] : []))}
                            className="dark:border-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800 rounded-lg bg-rose-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-300"
                        >-</button>
                    </div>
                ))}
            </div>

            {errorOccurred ? <p className="font-bold text-rose-300">Please make sure you have filled out all provided fields.</p> : null}
            <button
                className="dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mb-8 me-2 mt-4 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                onClick={() => {
                    if (appNameRef.current == undefined || repoPathRef.current == undefined) {
                        setErrorOccurred(true);
                        return
                    }

                    const appName = appNameRef.current.value
                    const repoPath = repoPathRef.current.value

                    if (repoPath == "" || appName == "") {
                        setErrorOccurred(true);
                        return
                    };

                    const data: Data = {
                        appIconUrl,
                        appName,
                        repoPath,
                        questions
                    }

                    if (JSURL.stringify(JSON.stringify(data)).length > 2000) {
                        alert("The generated URL is longer than 2048 characters! This URL cannot be guaranteed to work on all browsers.")
                    }

                    navigate(`/?e=${JSURL.stringify(JSON.stringify(data))}`, { replace: true })
                    navigate(`/?q=${JSURL.stringify(JSON.stringify(data))}`)
                }}>
                CREATE LINK
            </button>
        </div >
    )
}