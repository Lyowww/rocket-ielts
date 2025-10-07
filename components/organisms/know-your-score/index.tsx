"use client";

import { Controller } from "react-hook-form";
import useKnowYourScore from "./useKnowYourScore";
import { Button } from "@/components/atom/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/atom/select";

const KnowYourScore = () => {
  const {
    control,
    tabs,
    selectedTab,
    errors,
    pathData,
    taskData,
    questionData,
    handleSubmit,
    handleChangeTab,
    handleFormSubmit,
    handleLogOut,
  } = useKnowYourScore();

  return (
    <div className="w-full mt-10">
      <div className="flex flex-wrap gap-6">
        {tabs.map((el) => {
          return (
            <button
              key={el.id}
              onClick={() => handleChangeTab(el.title)}
              className={`${
                selectedTab === el.title && "bg-primary text-white"
              } flex items-center text-lg font-bold cursor-pointer text-[#1E1E1E] bg-[#f2f2f2] rounded-[4px] gap-[10px] px-10 py-4`}
            >
              {el.icon}
              <p>{el.title}</p>
            </button>
          );
        })}
        <button
          onClick={handleLogOut}
          className={`
                flex items-center text-lg font-bold cursor-pointer text-[#1E1E1E] bg-[#f2f2f2] rounded-[4px] gap-[10px] px-10 py-4`}
        >
          <p>Logout</p>
        </button>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="mt-10 space-y-5 flex flex-col"
      >
        <div className="flex lg:flex-row flex-col items-center gap-4">
          <figure className="lg:w-[400px] w-full">
            <Controller
              control={control}
              name="path"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-6 text-lg">
                    <SelectValue placeholder="Choose your path" />
                  </SelectTrigger>
                  <SelectContent>
                    {pathData?.map((option) => (
                      <SelectItem key={option.title} value={option.title}>
                        {option.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors?.path && (
              <p className="text-red-500 text-sm mt-2">{errors.path.message}</p>
            )}
          </figure>
          <figure className="lg:w-[400px] w-full">
            <Controller
              control={control}
              name="task"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full py-6 text-lg">
                    <SelectValue placeholder="Choose your task" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskData?.map((option) => (
                      <SelectItem key={option.title} value={option.title}>
                        {option.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors?.task && (
              <p className="text-red-500 text-sm mt-2">{errors.task.message}</p>
            )}
          </figure>
        </div>

        <figure className="lg:w-[400px] w-full">
          <Controller
            control={control}
            name="question"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full py-6 text-lg">
                  <SelectValue placeholder="Choose your Question" />
                </SelectTrigger>
                <SelectContent>
                  {questionData?.map((option) => (
                    <SelectItem key={option.title} value={option.title}>
                      {option.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors?.question && (
            <p className="text-red-500 text-sm mt-2">
              {errors.question.message}
            </p>
          )}
        </figure>
        <div className="w-full mt-4">
          <Button
            className="bg-[#d32f2f] h-[46px] text-lg rounded-none"
            type="submit"
          >
            Start Your Test
          </Button>
        </div>
      </form>
    </div>
  );
};

export default KnowYourScore;
