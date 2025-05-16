import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "./Button";

interface GoBackProps {
  url?: string;
  className?: string;
}

export function GoBack({ url, ...props }: GoBackProps) {
  const navigate = useNavigate();

  function handleBack() {
    console.log("Current location:", window.location.pathname)
    console.log("History length:", window.history.length)

    if (url) {
      console.log("Navigating to url prop:", url)
      navigate(url)
    } else {
      console.log("Navigating back (-1)")
      navigate(-1)
    }
  }

  return (
    <Button className={`flex items-center ${props.className}`} onClick={handleBack} {...props}><ChevronLeft />Go back</Button>
  )
}