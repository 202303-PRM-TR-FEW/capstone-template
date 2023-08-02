
'use client'

import { IoIosArrowBack } from 'react-icons/io';
import { useState } from 'react';
import { FaUpload, FaCalendarAlt } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { BsFillSendCheckFill } from 'react-icons/bs'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './KickOff.css';
import Button from '../Button/Button';
import { auth } from "../../firebase/firebase";
import { useForm } from "react-hook-form";
import { useAuthState } from 'react-firebase-hooks/auth';
import { addUserCampaign, getAllUserCampaigns } from '@/app/lib/features/campaignSlice';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/app/lib/features/kickOffModalSlice';

const PaymentModal = () => {
  const [user, loading] = useAuthState(auth)
  const dispatch = useDispatch()
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [uploadState, setUploadState] = useState(true)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  }

  const handleCalendarIconClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const onSubmit = async (data) => {
    const { projectName, goal, about, file } = data
    const userId = user.uid
    await dispatch(addUserCampaign({ projectName, goal, about, file, startDate, endDate, userId, formatDate, today, nextMonth }))
    await dispatch(getAllUserCampaigns(userId))
    await dispatch(closeModal())
  }

  const handleFileChange = (event) => {
    setUploadedFileName(event.target.files[0].name)

    if (event.target.files && event.target.files.length > 0) {
      setUploadState(false);
    } else {
      setUploadState(true);
    }
  };

  const handleCancel = () => {
    setShowCalendar(false);
  };

  const handleModalToggle = () => {
    dispatch(closeModal())
  }

  return (
    <main>
      <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen bg-zinc-950 bg-opacity-50 modal-background">
        <form onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-50 lg:w-[50%] lg:h-[auto] rounded-xl p-4 flex flex-col justify-between sm:w-[75%] sm:h-[75%]">
          <div>
            <div>
              <Button type="button" clickAction={handleModalToggle}>
                <IoIosArrowBack size={28} />
              </Button>
            </div>
            <div className="lg:m-2 md:m-0 lg:my-4 md:my-1 lg:text-[40px] md:text-[20px]">
              Kick-off <br /> your project
            </div>
            <div className="flex flex-col md:flex-row justify-between m-2">
              <div className="flex flex-col lg:mx-4">
                <div className="flex flex-col">
                  <label className="font-mulish text-lg md:text-[18px]">Name of your project</label>
                  <input {...register("projectName", { required: true, pattern: /^(?=.*[a-zA-Z])[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*(?:\s[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*)*$/ })}
                    placeholder="Build a cat shelter with us!"
                    className="title-input bg-slate-50 p-2 input-field focus:outline-none focus:ring-0 project-name-input" />
                  {errors.projectName?.type === 'required' && <p role="alert" className="text-end text-red-600 italic text-[14px]">Project Name is required</p>}
                  {errors.projectName?.type === 'pattern' && <p role="alert" className="text-end text-red-600 italic text-[14px]">Project Name is invalid</p>}
                </div>
                <div className="flex flex-col relative">
                  <label className="font-mulish text-lg md:text-[18px]">Add your goal</label>
                  <span className="absolute left-1 top-[35px] text-black text-[25px] font-KronaOne">$</span>
                  <input {...register("goal", { required: true, pattern: /^[1-9][0-9]*$/ })}
                    className="bg-slate-50 text-black pl-7 text-[30px] w-full input-field focus:outline-none focus:ring-0 p-2" />
                  {errors.goal?.type === 'required' && <p role="alert" className="text-end text-red-600 italic text-[14px]">Goal is required</p>}
                  {errors.goal?.type === 'pattern' && <p role="alert" className="text-end text-red-600 italic text-[14px]">Goal is invalid</p>}
                </div>
                <div className="flex flex-col">
                  <label className="font-mulish text-lg md:text-[18px]">Add your timeline</label>
                  <div className="flex flex-row justify-between relative">
                    <input
                      type="text"
                      name="input-field"
                      autoComplete="off"
                      className="title-input text-[15px] bg-slate-50 py-0 px-2 text-black font-medium text-base leading-normal text-left uppercase input-field focus:outline-none focus:ring-0"
                      onClick={handleCalendarIconClick}
                      readOnly
                      value={startDate && endDate ? `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear().toString().slice(-2)} - ${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear().toString().slice(-2)}` : `${formatDate(today)} - ${formatDate(nextMonth)}`}
                    />
                    {errors.calendar?.type === 'required' && <p role="alert" className="text-end text-red-600 italic text-[14px]">Timeline is required</p>}
                    <FaCalendarAlt
                      className="border-[1px] border-black rounded-lg p-3 absolute right-2 top-[-15px] cursor-pointer"
                      size={40}
                      onClick={handleCalendarIconClick}
                    />
                    {showCalendar && (
                      <div className="calendar-modal absolute h-auto top-[40%] right-[5%] custom-calendar">
                        <div className='text-right mr-2'>
                          <Button type="button" clickAction={handleCancel}>
                            <CgClose className="mt-2 mr-1 font-bold" size={20} />
                          </Button>
                        </div>
                        <div className="calendar-container">
                          <DatePicker
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            selectsRange
                            inline
                            calendarClassName="custom-calendar"
                            showYearDropdown
                            showMonthDropdown
                            yearDropdownItemNumber={5}
                            minDate={today}
                            dayClassName={(date) => {
                              if (date <= today) {
                                return "past-day";
                              } else {
                                return undefined
                              }
                            }}
                          />
                        </div>
                        <div className="confirm-button h-8 mb-2">
                          <Button type="button" clickAction={handleCalendarIconClick}>
                            Confirm
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-400 border rounded border-zinc-400 h-auto"></div>
              <div className="lg:mx-4 md:w-auto">
                <div className="flex flex-col">
                  <label className="font-mulish text-lg md:text-[18px]">About your project</label>
                  <input {...register("about", { required: true, pattern: /^(?=.*[a-zA-Z])[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*(?:\s[a-zA-Z\d]+(?:-[a-zA-Z\d]+)*)*$/ })}
                    placeholder="So many cats, so little homes. We want to provide home and care to them all. Help us build a dream shelter for all cats in our town."
                    className="title-input bg-slate-50 lg:py-7 md:py-1 input-field focus:outline-none focus:ring-0" />
                  {errors.about?.type === 'required' && <p role="alert" className="text-end text-red-600 italic text-[14px]">About is required</p>}
                  {errors.about?.type === 'pattern' && <p role="alert" className="text-end text-red-600 italic text-[14px]">About is invalid</p>}
                </div>
                <div className="flex flex-col items-center lg:my-10 md:my-1">
                  <input {...register("file", { required: true })}
                    type="file"
                    className="hidden"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onInput={handleFileChange}
                  />
                  {uploadState ? (
                    <>
                      <span className="text-black px-4 text-[18px]">Add media</span>
                      <span className="text-black pb-4 text-[12px]">(.jpg/.jpeg/.png)</span>

                      <label htmlFor="file-input" className="flex justify-center">
                        <FaUpload className="border-[1px] border-black rounded-lg p-3 cursor-pointer" size={40} />
                      </label>
                    </>) : (
                    <>
                      <span className="text-black px-4 text-[18px] text-center">File ready to be uploaded</span>
                      <BsFillSendCheckFill title={uploadedFileName} size={30} className='m-1' />
                      <span className="text-black px-4 text-[18px]" ></span>
                    </>)
                  }
                  {errors.file?.type === 'required' && <p role="alert" className="text-end text-red-600 italic text-[14px]">Media is required</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end lg:mt-5 md:mt-auto">
            <Button
              type="submit"
              style="bg-zinc-950 rounded-md w-full p-2 text-white text-[15px]"
            >
              Upload project
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PaymentModal;