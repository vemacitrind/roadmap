import { Button } from "@/components/ui/button"

const ButtonOutline = (props) => {
  return <Button variant="outline" className="global-button">{props.children}</Button>;
};

export default ButtonOutline;