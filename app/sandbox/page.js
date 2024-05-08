import Footer from "@/components/footer/Footer";
import Sandbox from "../containers/Sandbox/Sandbox";
import Header from "@/components/headers/Header";
import { Spacing } from "../components/Layout/Spacing";

export default function SandboxPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <section>
          <Spacing size="5x-large" />
          <h2>sandbox</h2>
          <Spacing size="x-large" />
          <main>
            <p>
              The sandbox is a space in which you can drop a .zip of your
              project and see how it would behave when it will be minted on
              xmutant. If your artwork does not behave properly in the sandbox,
              it will not work after being minted. <br />
              <span>If you are new to the platform please read our </span>
            </p>
            <p>
              Please make sure that your project follows the xmutant guidelines.
            </p>

            <Sandbox />
          </main>
        </section>
      </main>
      <Footer />
    </>
  );
}
