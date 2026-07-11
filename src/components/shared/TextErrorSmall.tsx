const TextErrorSmall = ({ error } : { error: string | undefined }) => {

  return (
    <small className="text-sm text-destructive text-center">
      {error}
    </small>
  );
};

export default TextErrorSmall;