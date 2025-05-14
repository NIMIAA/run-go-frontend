import React, { ReactNode } from "react";

export interface ActivityCardInterface {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
  statistics?: {
    increase: boolean;
    value: number;
  };
}

export default function ActivityCard({
  label,
  value,
  statistics,
  icon,
  className,
}: ActivityCardInterface) {
  const message = `${statistics?.increase ? "+" : "-"}${statistics?.value}% ${
    statistics?.increase ? "increase" : "decrease"
  } from last month`;
  return (
    <>
      <div
        className={
          "bg-white card  shadow-sm px-6 pt-4 pb-6 rounded-xl " + className
        }
      >
        <div className="p-2 border-gray-200 border-1 w-fit rounded-full mb-6 ">
          {icon}
        </div>
        <div className="">
          <h2 className="card-title">{value}</h2>
          <p className="text-gray-400 prose-sm leading-2 mt-2">{label}</p>
          {statistics && (
            <small
              className={
                statistics?.increase
                  ? "text-green-500 mt-4 block "
                  : "text-red-500 mt-4 block "
              }
            >
              {message}
            </small>
          )}
        </div>
      </div>
    </>
  );
}
