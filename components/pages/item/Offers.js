import Link from "next/link";

export default function Offers({ tokenData }) {
  const bids = tokenData.activityLog.filter((log) => log.activityType === 4);

  return (
    <div
      role="table"
      className="scrollbar-custom grid max-h-72 w-full grid-cols-3 overflow-y-auto rounded-lg rounded-tl-none border border-jacarta-100 bg-white text-sm dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white"
    >
      <div className="contents" role="row">
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            Price
          </span>
        </div>
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            Timestamp
          </span>
        </div>
        <div
          className="sticky top-0 bg-light-base py-2 px-4 dark:bg-jacarta-600"
          role="columnheader"
        >
          <span className="w-full overflow-hidden text-ellipsis text-jacarta-700 dark:text-jacarta-100">
            From
          </span>
        </div>
      </div>
      {bids.map((bid, i) => (
        <div key={i} className="contents" role="row">
          <div
            className="flex items-center whitespace-nowrap border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            <span className="text-sm font-medium tracking-tight text-green">
              {bid.price} BTT
            </span>
          </div>
          <div
            className="flex items-center border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            {new Date(bid.timestamp * 1000).toLocaleString()}
          </div>
          <div
            className="flex items-center border-t border-jacarta-100 py-4 px-4 dark:border-jacarta-600"
            role="cell"
          >
            <Link href={`/user/${bid.user}`} className="text-accent">
              {bid.user}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
