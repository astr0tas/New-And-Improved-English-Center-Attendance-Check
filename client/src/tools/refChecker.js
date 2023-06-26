export const isRefValid = (ref, idx = -1) =>
{
      if (idx === -1)
            return ref.current !== null && ref.current !== undefined;
      return ref.current[idx] !== null && ref.current[idx] !== undefined;
}

export const isRefNotValid = (ref, idx = -1) =>
{
      if (idx === -1)
            return ref.current === null || ref.current === undefined;
      return ref.current[idx] === null || ref.current[idx] === undefined;
}