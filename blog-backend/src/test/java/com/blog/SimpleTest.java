package com.blog;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 简单测试类，验证测试框架基本功能
 */
class SimpleTest {

    @Test
    void testBasicAssertion() {
        assertEquals(2, 1 + 1);
        assertTrue(true);
        assertNotNull("test");
    }

    @Test
    void testStringOperations() {
        String str = "Hello World";
        assertEquals(11, str.length());
        assertTrue(str.contains("World"));
        assertEquals("HELLO WORLD", str.toUpperCase());
    }

    @Test
    void testMathOperations() {
        assertEquals(10, Math.max(5, 10));
        assertEquals(5, Math.min(5, 10));
        assertEquals(25, Math.pow(5, 2), 0.001);
    }
}