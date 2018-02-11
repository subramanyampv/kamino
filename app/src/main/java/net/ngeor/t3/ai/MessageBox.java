package net.ngeor.t3.ai;

/**
 * Abstraction over Android's Toast.
 */
@FunctionalInterface
public interface MessageBox {
    void show(String message);
}
