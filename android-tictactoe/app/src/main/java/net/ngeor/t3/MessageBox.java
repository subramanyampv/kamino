package net.ngeor.t3;

/**
 * Abstraction over Android's Toast.
 */
@FunctionalInterface
public interface MessageBox {
    void show(int message);
}
