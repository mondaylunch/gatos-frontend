import {signIn} from "@auth/solid-start/client";

import {Navbar} from "~/components/shared/Navbar";
import {Show} from "solid-js";
import {user} from "~/lib/session";

export default function Home() {
  const login = () => signIn("auth0");

  return (
    <div>
      <Navbar/>
      <div class="bg-neutral-900 h-screen flex flex-col justify-center items-center bg-neutral-900">
        <span class="text-6xl font-semibold mb-1 text-white">
            Welcome to
          </span>

        <div class="gradient-text text-4xl font-bold">


        </div>
        <div class="w-full max-w-md">
          <Show when={!user()}>
            <div class="bg-white p-7 rounded-[45px] shadow-md flex justify-center">
              <button
                type="button"
                onClick={login}
                class="w-full mr-2 bg-indigo-500 text-white p-3 rounded-[30px] hover:bg-indigo-600"
              >
                Log in or Sign Up
              </button>
            </div>
          </Show>
        </div>


      </div>
      <div class="bg-neutral-900 relative -mt-12 lg:-mt-24">
        <svg viewBox="0 0 1428 174">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-2.000000, 44.000000)" fill="#FFFFFF" fill-rule="nonzero">
              <path
                d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
                opacity="0.100000001"></path>
              <path
                d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                opacity="0.100000001"></path>
              <path
                d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
                id="Path-4" opacity="0.200000003"></path>
            </g>
            <g transform="translate(-4.000000, 76.000000)" fill="#FFFFFF" fill-rule="nonzero">
              <path
                d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"></path>
            </g>
          </g>
        </svg>
      </div>
      <div class="container max-w-5xl mx-auto m-8">
        <h2 class="w-full my-2 text-4xl font-bold leading-tight text-center text-gray-800">
          About us
        </h2>
      </div>
      <div class="flex flex-wrap">
        <div class="w-5/6 sm:w-1/2 p-20">
          <h3 class="text-3xl text-gray-800 font-bold leading-none mb-3">
            What is this?
          </h3>
          <p class="text-2xl text-gray-600 mb-8">
            Gatos is an open source web tool designed for inexperienced programmers to create their own automated
            scripts.
          </p>
        </div>
        <div class="w-full sm:w-1/2 p-6">
          <div class="flex flex-wrap justify-center">
            <img src="/images/flow.png" class="h-auto max-w-sm rounded-[45px]" alt="Flow image"/>
          </div>
        </div>

        <div class="w-full sm:w-1/2 p-6">
          <div class="flex flex-wrap justify-center">
            <img src="/images/discordintegration.png" class="h-auto max-w-sm rounded-[45px]" alt="Flow image"/>
          </div>
        </div>
        <div class="w-5/6 sm:w-1/2 p-20">
          <h3 class="text-3xl text-gray-800 font-bold leading-none mb-3">
            Why should I be interested?
          </h3>
          <p class="text-2xl text-gray-600 mb-8">
            Whether you wish to set up some automated calculations, scripts, or would like your own easy to make a
            fully customisable bot for Discord, Gatos is the tool for you.
          </p>
        </div>

        <div class="w-5/6 sm:w-1/2 p-20">
          <h3 class="text-3xl text-gray-800 font-bold leading-none mb-3">
            Who's this for?
          </h3>
          <p class="text-2xl text-gray-600 mb-8">
            Anyone interested in learning automation but doesn't know where to start. Gatos offers a simple and easy to
            use interface to let you experiment with how to make your jobs just the little bit easier.
          </p>
        </div>
        <div class="w-full sm:w-1/2 p-6">
          <div class="flex flex-wrap justify-center">
            <img src="/images/gatos panel.png" class="h-auto max-w-sm rounded-[45px]" alt="Flow image"/>
          </div>
        </div>

      </div>

    </div>
  );
}
