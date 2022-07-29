import { ERC20_DECIMALS } from "./constants";

// format a wallet address
export const truncateAddress = (address) => {
  if (!address) return;
  return (
    address.slice(0, 5) +
    "..." +
    address.slice(address.length - 4, address.length)
  );
};

// convert from big number
export const formatBigNumber = (num) => {
  if (!num) return;
  return num.shiftedBy(-ERC20_DECIMALS).toFixed(2);
};

export const convertTime = (secs) => {
  if (secs === 0) {
    return "--";
  }

  let dateObj = new Date(secs * 1000);

  let date = dateObj.toLocaleDateString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let time = dateObj.toLocaleString("en-us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return date + ", " + time;
};
