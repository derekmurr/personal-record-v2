import { useState } from 'react'

const Toggle = ({ children, initial = false }) => {
  const [on, setOn] = useState(initial);

  const toggle = () => {
    setOn(!on);
  }

  return children({ on, toggle });
}

export default Toggle;
