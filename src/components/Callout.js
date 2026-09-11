   export default function Callout({ children, type = "info" }) {
     const colors = { info: "#e7f3ff", warning: "#fff4e5" };
     return (
       <div style={{ background: colors[type], padding: "12px 16px", borderRadius: 6 }}>
         {children}
       </div>
     );
   }