import { ChevronLeft } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

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