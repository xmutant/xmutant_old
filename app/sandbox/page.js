

import Sandbox from "../containers/Sandbox/Sandbox";

export default function SandboxPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <section>
          <h2 >sandbox</h2>

        <main >
          <p>
            The sandbox is a space in which you can drop a .zip of your project
            and see how it would behave when it will be minted on fxhash. If
            your artwork does not behave properly in the sandbox, it will not
            work after being minted. <br />
            <span>If you are new to the platform please read our </span>
           
          </p>
          <p>
            Please make sure that your project follows the fxhash
            .
          </p>
          
            <Sandbox />
          
        </main>
      </section>

      

      
    </main>
  );
}
