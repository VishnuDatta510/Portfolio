"use client";
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiArrowUp, FiMail, FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <h2 className="footer-heading">
          <span className="footer-heading-line">
            LET&apos;S CREATE SOMETHING
          </span>
          <span className="footer-heading-line amazing-glow">AMAZING</span>
        </h2>

        <div className="footer-bottom">
          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/in/vishnudattagb/"
              className="footer-social-link hoverable contact-link-premium"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin /> LINKEDIN
            </a>
            <a
              href="https://github.com/VishnuDatta510"
              className="footer-social-link hoverable contact-link-premium"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> GITHUB
            </a>
            <a
              href="https://leetcode.com/u/Vishno-Way/"
              className="footer-social-link hoverable contact-link-premium"
              aria-label="LeetCode"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiLeetcode /> LEETCODE
            </a>
            <a
              href="mailto:vishnudatta2004@gmail.com"
              className="footer-social-link contact-link-premium hoverable"
            >
              <FiMail /> vishnudatta2004@gmail.com
            </a>
            <a
              href="tel:8186071702"
              className="footer-social-link contact-link-premium hoverable"
            >
              <FiPhone /> 8186071702
            </a>
          </div>

          <div className="footer-meta">LAST UPDATED 16/3/2026</div>

          <button
            className="footer-back-to-top hoverable"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            BACK TO TOP <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
