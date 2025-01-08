Hidden Markov Models
============

Video Lectures
============

[<img src="https://github.com/StarlangSoftware/Hmm/blob/master/video1.jpg" width="50%">](https://youtu.be/zHj5mK3jcyk)[<img src="https://github.com/StarlangSoftware/Hmm/blob/master/video2.jpg" width="50%">](https://youtu.be/LM0ld3UKCEs)

For Developers
============
You can also see [Java](https://github.com/starlangsoftware/Hmm), [Python](https://github.com/starlangsoftware/Hmm-Py), 
[Cython](https://github.com/starlangsoftware/Hmm-Cy), [Swift](https://github.com/starlangsoftware/Hmm-Swift), [C++](https://github.com/starlangsoftware/Hmm-CPP), [Php](https://github.com/starlangsoftware/Hmm-Php), [C](https://github.com/starlangsoftware/Hmm-C),
or [C#](https://github.com/starlangsoftware/Hmm-CS) repository.

## Requirements

* [Node.js 14 or higher](#Node.js)
* [Git](#git)

### Node.js 

To check if you have a compatible version of Node.js installed, use the following command:

    node -v
    
You can find the latest version of Node.js [here](https://nodejs.org/en/download/).

### Git

Install the [latest version of Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Npm Install

	npm install nlptoolkit-hmm
	
## Download Code

In order to work on code, create a fork from GitHub page. 
Use Git for cloning the code to your local or below line for Ubuntu:

	git clone <your-fork-git-link>

A directory called util will be created. Or you can use below link for exploring the code:

	git clone https://github.com/starlangsoftware/hmm-js.git

## Open project with Webstorm IDE

Steps for opening the cloned project:

* Start IDE
* Select **File | Open** from main menu
* Choose `Hmm-Js` file
* Select open as project option
* Couple of seconds, dependencies will be downloaded. 

Detailed Description
============

+ [Hmm](#hmm)

## Hmm

Hmm modelini üretmek için

	Hmm(states: Set<State>, observations: Array<Array<State>>, emittedSymbols: Array<Array<Symbol>>)


Viterbi algoritması ile en olası State listesini elde etmek için

	viterbi(s: Array<Symbol>): Array<State>
