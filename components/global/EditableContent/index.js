const EditableContent = (props) => {
   return (
      <div className={props.className}>
         <Input ref={props.ref} {...props} />
      </div>
   );
};

const Input = React.forwardRef((props, ref) => (
   <input type="text" {...props} ref={ref} />
));

export default EditableContent;
