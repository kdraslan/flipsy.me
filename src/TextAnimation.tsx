import React, { useEffect, useRef } from 'react';
import './TextAnimation.css';

const TextAnimation = () => {
    const animatedElement = useRef<SVGPathElement | null>(null);

    useEffect(() => {
        // Apply animation when component mounts
        const applyAnimation = () => {
            if (animatedElement.current) {
                animatedElement.current.classList.add('animate-pull-release');
            }
        };

        // Small delay to ensure rendering is complete
        const timer = setTimeout(applyAnimation, 300);

        return () => {
            clearTimeout(timer);
            if (animatedElement.current) {
                animatedElement.current.classList.remove('animate-pull-release');
            }
        };
    }, []);

    return (
        <div className="logo-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
                <path ref={animatedElement} fill="#e4e4e4" d="M1705.605 634.705q-13.54 13.107-28.122 23.126-26.433 18.158-60.083 18.158c-18.15 0-31.863-5.251-41.126-15.755-9.249-10.503-13.88-25.724-13.88-45.662 0-9.97 2.49-27.772 7.482-53.407 4.618-22.431 6.94-37.919 6.94-46.464 0-5.697-1.96-8.545-5.869-8.545-4.631 0-11.223 5.964-19.763 17.891-8.553 11.928-17.093 27.683-25.646 47.265q-12.81 29.374-20.82 61.952c-3.923 17.09-8.457 28.483-13.617 34.18-5.173 5.697-13.449 8.545-24.84 8.545-11.752 0-20.555-5.607-26.438-16.823q-8.804-16.823-8.804-40.856 0-20.295 5.34-58.747c2.852-22.787 4.27-37.741 4.27-44.862q0-8.545-5.883-8.545c-5.327 0-12.1 6.409-20.292 19.226s-16.105 29.196-23.754 49.134c-7.664 19.939-13.797 39.521-18.429 58.748-3.922 16.734-8.456 28.038-13.63 33.913-2.35 2.687-19.916 9.8-35.84 10.627-18.887.982-36.48-5.13-38.01-13.275-3.561-18.96.834-58.56 11.376-60.6 40.264-7.797 49.665-36.446 51.71-51.83 2.656-19.91-.682-44.467-27.83-57.983-14.395-7.166-7.288-25.546-2.796-39.765 3.213-10.325 8.47-17.89 15.758-22.697q10.953-7.21 30.71-7.21c7.12 0 12.113.89 14.964 2.67 2.837 1.78 4.27 5.163 4.27 10.147q0 8.545-8.011 38.453-5.34 21.363-8.554 37.118-3.191 15.755-5.34 39.254c9.624-27.772 21.098-51.27 34.45-70.497s27.065-33.557 41.126-42.993 27.329-14.152 39.79-14.152 21.266 2.848 26.44 8.545c5.16 5.696 7.733 14.42 7.733 26.169q0 17.09-10.14 61.952-4.276 19.226-5.882 28.84 26.703-65.69 59.29-95.599c21.71-19.938 42.015-29.907 60.875-29.907q34.714 0 34.714 34.714c0 13.886-3.908 38.987-11.738 75.303-6.774 30.976-10.153 51.449-10.153 61.418q0 21.363 15.48 21.363 10.702 0 25.368-13.085 7.99-7.103 18.859-19.002-1.502-10.89-1.502-22.922c0-24.567 5.174-47.443 15.493-68.628s24.66-38.007 42.99-50.469c18.345-12.462 39.081-18.692 62.224-18.692 20.654 0 37.204 6.141 49.666 18.425q18.692 18.425 18.692 49.935c0 24.567-8.804 45.663-26.439 63.287-17.621 17.624-47.62 31.6-89.985 41.924 8.54 16.379 22.962 24.568 43.254 24.568q21.905 0 36.05-10.148c9.443-6.765 20.389-18.158 32.85-34.18 4.27-5.34 9.082-8.011 14.423-8.011 4.617 0 8.275 2.136 10.946 6.409q4.005 6.409 4.005 17.624c0 12.818-3.032 23.855-9.082 33.112-9.972 15.31-23.045 27.238-39.248 35.783q-24.304 12.817-57.955 12.817-51.258 0-79.568-30.709a97 97 0 0 1-8.47-10.575m91.78-157.923q-19.757 0-33.38 22.965c-9.082 15.31-13.616 33.824-13.616 55.543v1.068c21.001-4.984 37.566-12.461 49.666-22.43 12.114-9.97 18.164-21.541 18.164-34.715 0-6.765-1.878-12.195-5.605-16.289q-5.612-6.142-15.23-6.142" />
                <path fill="#01afab" d="M1293.637 580.362c2.552-21.234 4.452-38.186 9.876-63.213 1.657-7.64 13.345-3.41 19.222 2.95q8.816 9.538 8.816 23.7 0 18.207-12.428 31.502c-8.286 8.864-26.735 15.463-25.486 5.061" />
                <path d="M1276.69 389.474c10.196 0 17.306 1.331 21.312 3.995q5.983 3.996 5.983 13.318c0 10.655-5.775 48.612-17.307 113.872-10.214 62.597-16.214 99.666-17.983 111.209-16.422 114.093-39.07 204.436-67.927 271.028s-67.25 99.888-115.2 99.888c-22.648 0-41.065-6.993-55.268-20.977s-21.313-32.297-21.313-54.938q0-31.298 14.307-63.928 14.333-32.63 53.273-74.916c25.978-28.19 62.725-60.487 110.224-96.89l1.994-15.317c3.104-16.426 6.66-39.955 10.648-70.587-8.88 31.964-21.296 56.27-37.285 72.918s-32.845 24.972-50.603 24.972q-29.966 0-48.955-27.636c-12.642-18.424-18.972-41.398-18.972-68.922q0-49.944 6.66-91.564c4.44-27.746 11.757-57.158 21.971-88.234 4.44-13.318 10.648-22.863 18.643-28.634s20.653-8.657 37.96-8.657c9.764 0 16.544 1.553 20.307 4.661q5.671 4.661 5.671 13.984 0 5.328-7.335 35.96c-4.44 16.426-7.995 31.298-10.648 44.616a1571 1571 0 0 0-9.33 52.275c-2.653 16.648-3.988 30.3-3.988 40.954 0 16.87 4.647 25.305 13.977 25.305q9.989 0 24.972-19.978c9.989-13.318 20.654-33.518 31.96-60.598 11.324-27.081 22.319-60.377 32.967-99.888 3.555-13.318 9-22.863 16.318-28.634s18.313-8.657 32.967-8.657M1092.886 938.19q16.648 0 37.302-38.624c13.752-25.748 27.52-68.59 41.273-128.522q-51.27 43.285-74.24 78.912c-15.312 23.75-22.977 44.505-22.977 62.263 0 7.547 1.44 13.762 4.335 18.646q4.318 7.325 14.307 7.325" />
                <path fill="#01afab" d="M1039.605 698.17q-33.483 13.899-57.593 5.796t-32.126-27.415c-4.632-11.158-4.567-22.504.206-34.044 4.76-11.535 15.094-20.604 30.965-27.192 5.586-2.32 12.344-4.496 20.298-6.54 7.966-2.05 13.96-3.658 17.995-4.83-5.064-10.977-11.891-20.468-20.494-28.469s-18.248-15.19-28.95-21.563c-10.69-6.38-20.47-11.753-29.328-16.126-7.527 53.56-47.746 111.41-72.697 102.123-55.112-20.515 13.706-120.9 14.521-141.363s1.511-48.169 2.099-83.126q.46-33.396 39.097-49.435c12.014-4.987 20.821-7.385 26.433-7.2s9.405 2.637 11.364 7.358c1.069 2.574 1.897 7.01 2.495 13.303s.558 12.848-.13 19.673c-1.311 18.657.254 33.35 4.708 44.08 2.672 6.438 7.87 12.58 15.581 18.435s18.7 12.613 32.941 20.284c21.214 12.324 38 23.342 50.33 33.064s21.622 22.092 27.857 37.112c7.481 18.023 10.382 36.817 8.688 56.386-1.681 19.564-7.994 37.404-18.914 53.507-10.92 16.105-26.04 28.167-45.346 36.181" />
                <path d="M488.256 654.96q-15.038 13.845-31.239 24.751-33.594 22.618-76.17 22.618-45.237 0-72.512-32.93-27.274-32.928-37.254-89.475-22.618 5.988-47.897 5.988-21.954 0-48.563-3.327 9.313 41.91 15.3 93.8 5.988 51.889 5.988 85.151 0 71.847-23.284 109.766t-61.203 37.919q-47.896 0-68.187-67.855T22.945 636.47q0-127.726 27.607-259.113 27.609-131.385 75.838-217.535 48.231-86.15 106.107-86.15 31.266 0 48.896 27.94 17.629 27.941 17.629 75.174 0 156.332-186.934 340.605-6.653 65.195-6.653 114.422 0 68.52 4.657 140.7t15.3 72.179q19.958 0 19.958-69.186 0-51.888-6.985-100.452t-18.96-102.447q-.665-8.65 5.655-21.953 6.32-13.305 15.633-23.284 9.314-9.98 16.631-9.979 8.649 0 27.275 1.33 21.288 1.332 31.932 1.331 23.949 0 49.228-6.652v-1.996q0-81.16 20.956-184.938 20.955-103.779 61.867-178.286t97.459-74.507q31.932 0 50.226 29.603t18.294 84.819q0 53.885-19.957 122.405t-57.877 131.386-89.142 100.785q2.66 47.232 13.97 66.857 11.31 19.624 33.262 19.624 27.275 0 47.898-15.633 14.576-11.048 34.799-33.23 1.049-27.349 7.444-66.557 7.65-46.899 19.624-87.48 5.988-21.287 15.966-29.27 9.98-7.983 31.932-7.983 33.928 0 33.928 22.618 0 16.631-12.64 77.169-15.966 73.177-15.966 99.121 0 19.958 5.322 30.602t17.962 10.643q11.974 0 29.936-16.63 12.969-12.008 32.172-34.072a1837 1837 0 0 1 9.736-16.487c0-64.75-.45-109.766-1.333-135.045-.434-12.862 4.66-23.062 15.297-30.601 10.654-7.54 23.959-11.31 39.932-11.31 9.303 0 16.077 1.885 20.286 5.655 4.21 3.77 6.531 11.198 6.982 22.286 0 11.087.225 19.292.658 24.614 14.206-17.74 28.17-30.49 41.925-38.252 13.738-7.761 28.376-11.642 43.899-11.642 24.843 0 45.13 9.98 60.877 29.936 15.73 19.958 23.612 46.124 23.612 78.5 0 35.036-8.09 68.187-24.288 99.454-16.18 31.266-37.697 56.656-64.532 76.17s-55.541 29.715-86.153 30.601q-8.627 128.393-39.24 214.542-30.61 86.15-89.809 86.15-35.923 0-53.22-25.945-17.295-25.945-17.296-71.847 0-65.194 29.936-152.008 8.981-26.04 20.893-53.67-10.927 2.778-21.558 2.778-43.241 0-62.866-30.6-4.967-7.745-8.676-16.769m-269.73-515.428q-11.974 0-29.602 40.58-17.63 40.58-34.926 107.437t-29.936 141.365q53.22-60.538 81.825-126.064 28.606-65.527 29.271-122.738 0-40.58-16.631-40.58m212.88 0q-13.971 0-32.265 49.56t-32.93 125.4-17.961 148.35q33.262-33.93 56.546-82.824 23.283-48.895 34.26-99.121 10.976-50.227 10.976-90.806 0-50.56-18.627-50.56m302.03 498.934q23.933-5.322 44.228-26.277t32.275-51.89c7.969-20.622 11.97-42.242 11.97-64.86 0-13.306-2.667-23.395-7.986-30.27-5.318-6.874-12.421-10.31-21.291-10.31-15.955 0-35.255 16.852-57.88 50.558-.433 19.514-.658 48.12-.658 85.817 0 20.4-.225 36.145-.658 47.232m-127.071 299.36q17.955 0 29.934-78.166c7.987-52.11 13.08-116.972 15.298-194.584-19.057 44.35-34.146 86.703-45.232 127.062q-16.63 60.537-16.631 101.782 0 21.288 4.99 32.597 4.988 11.31 11.641 11.31M565.12 345.093q-27.94 0-41.91-12.973-13.97-12.972-13.97-36.255t18.293-38.917q18.295-15.634 45.57-15.634 24.614 0 39.914 11.975c10.203 7.983 15.296 19.292 15.296 33.927 0 17.74-5.752 31.821-17.291 42.243q-17.297 15.634-45.902 15.634" />
            </svg>
        </div>
    );
};

export default TextAnimation;
